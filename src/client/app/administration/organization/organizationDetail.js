(function () {
    'use strict';

    var controllerId = 'organizationDetail';

    angular.module('FHIRStarter').controller(controllerId,
        ['$location', '$routeParams', '$window', 'addressService', 'common', 'contactService', 'fhirServers', 'identifierService', 'localValueSets', 'organizationService', 'telecomService', organizationDetail]);

    function organizationDetail($location, $routeParams, $window, addressService, common, contactService, fhirServers, identifierService, localValueSets, organizationService, telecomService) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var logWarning = common.logger.getLogFn(controllerId, 'warning');
        var $q = common.$q;

        vm.activeServer = null;
        vm.cancel = cancel;
        vm.activate = activate;
        vm.contactTypes = undefined;
        vm.delete = deleteOrganization;
        vm.edit = edit;
        vm.getOrganizationReference = getOrganizationReference;
        vm.getTitle = getTitle;
        vm.goBack = goBack;
        vm.isSaving = false;
        vm.isEditing = true;
        vm.loadingOrganizations = false;
        vm.organization = undefined;
        vm.organizationTypes = undefined;
        vm.save = save;
        vm.states = undefined;
        vm.title = 'organizationDetail';

        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });

        Object.defineProperty(vm, 'canDelete', {
            get: canDelete
        });

        activate();

        function activate() {
            common.activateController([getActiveServer(), getOrganizationTypes()], controllerId).then(function () {
                getRequestedOrganization();
            });
        }

        function cancel() {

        }

        function canDelete() {
            return !vm.isEditing;
        }

        function canSave() {
            return !vm.isSaving;
        }

        function deleteOrganization(organization) {
            if (organization && organization.resourceId && organization.hashKey) {
                organizationService.deleteCachedOrganization(organization.hashKey, organization.resourceId)
                    .then(function () {
                        logSuccess("Deleted organization " + organization.resourceId);
                        $location.path('/organizations');
                    },
                    function (error) {
                        logError(error);
                    }
                );
            }
        }

        function edit(organization) {
            if (organization && organization.hashKey) {
                $location.path('/organization/edit/' + organization.hashKey);
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

        function getOrganizationTypes() {
            vm.organizationTypes = localValueSets.organizationType();
        }

        function getRequestedOrganization() {
            if ($routeParams.hashKey === 'new') {
                var data = organizationService.initializeNewOrganization();
                intitializeRelatedData(data);
                vm.title = 'Add New Organization';
                vm.isEditing = false;
            } else {
                if ($routeParams.hashKey) {
                    organizationService.getCachedOrganization($routeParams.hashKey)
                        .then(intitializeRelatedData, function (error) {
                            logError(error);
                        });
                } else if ($routeParams.id) {
                    var resourceId = vm.activeServer.baseUrl + '/Organization/' + $routeParams.id;
                    organizationService.getOrganization(resourceId)
                        .then(intitializeRelatedData, function (error) {
                            logError(error);
                        });
                }
            }

            function intitializeRelatedData(data) {
                vm.organization = data;
                if (angular.isUndefined(vm.organization.type)) {
                    vm.organization.type = { "coding": [] }
                }
                vm.title = vm.organization.name;
                identifierService.init(vm.organization.identifier);
                addressService.init(vm.organization.address, false);
                contactService.init(vm.organization.contact);
                telecomService.init(vm.organization.telecom, false, false);
            }
        }

        function getTitle() {
            var title = '';
            if (vm.organization) {
                title = vm.title = 'Edit ' + ((vm.organization && vm.organization.fullName) || '');
            } else {
                title = vm.title = 'Add New Organization';
            }
            return vm.title = title;
        }

        function goBack() {
            $window.history.back();
        }

        function save() {
            if (vm.organization.name.length < 5) {
                logError("Organization Name must be at least 5 characters");
                return;
            }
            var organization = organizationService.initializeNewOrganization();
            organization.name = vm.organization.name;
            organization.type = vm.organization.type;
            organization.address = addressService.mapFromViewModel();
            organization.telecom = telecomService.mapFromViewModel();
            organization.contact = contactService.mapFromViewModel();
            organization.partOf = vm.organization.partOf;
            organization.identifier = identifierService.getAll();
            organization.active = vm.organization.active;
            if (vm.isEditing) {
                organizationService.updateOrganization(vm.organization.resourceId, organization)
                    .then(processResult,
                    function (error) {
                        logError("Update failed: " + error.outcome.details);
                    });
            } else {
                organizationService.addOrganization(organization)
                    .then(processResult,
                    function (error) {
                        logError("Add failed: " + error.outcome.details);
                    });
            }

            function processResult(results) {
                var resourceVersionId = results.headers.location || results.headers["content-location"];
                if (angular.isUndefined(resourceVersionId)) {
                    logWarning("Organization saved, but location is unavailable. CORS not implemented correctly at remote host.");
                } else {
                    logSuccess("Organization saved at " + resourceVersionId);
                }
                vm.organization.resourceVersionId = resourceVersionId;
                vm.organization.fullName = organization.name;
                vm.isEditing = true;
                getTitle();
            }
        }
    }
})();