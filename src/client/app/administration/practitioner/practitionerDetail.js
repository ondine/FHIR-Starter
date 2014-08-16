(function () {
    'use strict';

    var controllerId = 'practitionerDetail';

    angular.module('FHIRStarter').controller(controllerId,
        ['$location', '$routeParams', '$window', 'addressService', 'attachmentService', 'common', 'demographicsService', 'fhirServers', 'humanNameService', 'identifierService', 'localValueSets', 'organizationService', 'practitionerService', 'telecomService', practitionerDetail]);

    function practitionerDetail($location, $routeParams, $window, addressService, attachmentService, common, demographicsService, fhirServers, humanNameService, identifierService, localValueSets, organizationService, practitionerService, telecomService) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var logWarning = common.logger.getLogFn(controllerId, 'warning');
        var $q = common.$q;

        vm.activeServer = null;
        vm.calculateAge = calculateAge;
        vm.cancel = cancel;
        vm.activate = activate;
        vm.delete = deletePractitioner;
        vm.edit = edit;
        vm.getOrganizationReference = getOrganizationReference;
        vm.getTitle = getTitle;
        vm.goBack = goBack;
        vm.isBusy = false;
        vm.isSaving = false;
        vm.isEditing = true;
        vm.loadingOrganizations = false;
        vm.practitioner = undefined;
        vm.save = save;
        vm.title = 'practitionerDetail';

        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });

        Object.defineProperty(vm, 'canDelete', {
            get: canDelete
        });

        activate();

        function activate() {
            common.activateController([getActiveServer()], controllerId).then(function () {
                getRequestedPractitioner();
            });
        }

        function calculateAge(birthDate) {
            if (birthDate) {
                var ageDifMs = Date.now() - birthDate.getTime();
                var ageDate = new Date(ageDifMs); // miliseconds from epoch
                return Math.abs(ageDate.getUTCFullYear() - 1970);
            } else {
                return undefined;
            }
        }

        function cancel() {

        }

        function canDelete() {
            return !vm.isEditing;
        }

        function canSave() {
            return !vm.isSaving;
        }

        function deletePractitioner(practitioner) {
            if (practitioner && practitioner.resourceId && practitioner.hashKey) {
                practitionerService.deleteCachedPractitioner(practitioner.hashKey, practitioner.resourceId)
                    .then(function () {
                        logSuccess("Deleted practitioner " + practitioner.resourceId);
                        $location.path('/practitioners');
                    },
                    function (error) {
                        logError(error);
                    }
                );
            }
        }

        function edit(practitioner) {
            if (practitioner && practitioner.hashKey) {
                $location.path('/practitioner/' + practitioner.hashKey);
            }
        }

        function getActiveServer() {
            fhirServers.getActiveServer()
                .then(function (server) {
                    return vm.activeServer = server;
                });
        }

        function getOrganizationReference(input) {
            var deferred = $q.defer();
            vm.loadingOrganizations = true;
            organizationService.getOrganizationReference(vm.activeServer.baseUrl, input)
                .then(function (data) {
                    vm.loadingOrganizations = false;
                    deferred.resolve(data);
                }, function (error) {
                    vm.loadingOrganizations = false;
                    logError(error);
                    deferred.reject();
                });
            return deferred.promise;
        }

        function getRequestedPractitioner() {
            if ($routeParams.hashKey === 'new') {
                var data = practitionerService.initializeNewPractitioner();
                intitializeRelatedData(data);
                vm.title = 'Add New Practitioner';
                vm.isEditing = false;
            } else {
                if ($routeParams.hashKey) {
                    practitionerService.getCachedPractitioner($routeParams.hashKey)
                        .then(intitializeRelatedData, function (error) {
                            logError(error);
                        });
                } else if ($routeParams.id) {
                    var resourceId = vm.activeServer.baseUrl + '/Practitioner/' + $routeParams.id;
                    practitionerService.getPractitioner(resourceId)
                        .then(intitializeRelatedData, function (error) {
                            logError(error);
                        });
                }
            }

            function intitializeRelatedData(data) {
                vm.practitioner = data;
                humanNameService.init(vm.practitioner.name);
                demographicsService.init(vm.practitioner.gender, vm.practitioner.maritalStatus);
                demographicsService.setBirthDate(vm.practitioner.birthDate);
                attachmentService.init(vm.practitioner.photo, "Photos");
                identifierService.init(vm.practitioner.identifier);
                addressService.init(vm.practitioner.address, true);
                telecomService.init(vm.practitioner.telecom, true, true);
                vm.practitioner.fullName = humanNameService.getFullName();
                if (vm.practitioner.organization && vm.practitioner.organization.reference) {
                    var reference = vm.practitioner.organization.reference;
                    if (common.isAbsoluteUri(reference) === false) {
                        vm.practitioner.organization.reference = vm.activeServer.baseUrl + '/' + reference;
                    }
                    if (angular.isUndefined(vm.practitioner.organization.display)) {
                        vm.practitioner.organization.display = reference;
                    }
                }
                vm.title = getTitle();
            }
        }

        function getTitle() {
            var title = '';
            if (vm.practitioner) {
                title = 'Edit ' + (vm.practitioner.fullName || 'Unknown');
            } else {
                title = 'Add New Practitioner';
            }
            return title;

        }

        function goBack() {
            $window.history.back();
        }

        function save() {
            var practitioner = practitionerService.initializeNewPractitioner();
            if (humanNameService.getAll().length === 0) {
                logError("Practitioner must have at least one name entry.");
                return;
            }
            toggleSpinner(true);
            practitioner.name = humanNameService.mapFromViewModel();
            practitioner.photo = attachmentService.getAll();

            practitioner.birthDate = demographicsService.getBirthDate();
            practitioner.gender = demographicsService.getGender();
            practitioner.maritalStatus = demographicsService.getMaritalStatus();
            practitioner.multipleBirthBoolean = demographicsService.getMultipleBirth();
            practitioner.multipleBirthInt =  demographicsService.getBirthOrder();
            practitioner.deceasedBoolean = demographicsService.getDeceased();
            practitioner.deceasedDate = demographicsService.getDeceasedDate();

            practitioner.address = addressService.mapFromViewModel();
            practitioner.telecom = telecomService.mapFromViewModel();
            practitioner.identifier = identifierService.getAll();

            practitioner.managingOrganization = vm.practitioner.managingOrganization;

            practitioner.active = vm.practitioner.active;
            if (vm.isEditing) {
                practitionerService.updatePractitioner(vm.practitioner.resourceId, practitioner)
                    .then(processResult,
                    function (error) {
                        logError("Update failed: " + error.outcome.details);
                        toggleSpinner(false);
                    });
            } else {
                practitionerService.addPractitioner(practitioner)
                    .then(processResult,
                    function (error) {
                        logError("Add failed: " + error.outcome.details);
                        toggleSpinner(false);
                    });
            }

            function processResult(results) {
                var resourceVersionId = results.headers.location || results.headers["content-location"];
                if (angular.isUndefined(resourceVersionId)) {
                    logWarning("Practitioner saved, but location is unavailable. CORS not implemented correctly at remote host.");
                } else {
                    logSuccess("Practitioner saved at " + resourceVersionId);
                }
                vm.practitioner.resourceVersionId = resourceVersionId;
                vm.practitioner.fullName = humanNameService.getFullName();
                vm.isEditing = true;
                vm.title = getTitle();
                toggleSpinner(false);
            }
        }

        function toggleSpinner(on) {
            vm.isBusy = on;
        }
    }
})();