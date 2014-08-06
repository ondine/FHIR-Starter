(function () {
    'use strict';

    var controllerId = 'organizationDetail';

    angular.module('FHIRStarter').controller(controllerId,
        ['$location', '$routeParams', '$window', 'addressService', 'common', 'contactService', 'fhirServers', 'identifierService', 'localValueSets', 'organizationService', 'telecomService', organizationDetail]);

    function organizationDetail($location, $routeParams, $window, addressService, common, contactService, fhirServers, identifierService, localValueSets, organizationService, telecomService) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var $q = common.$q;

        vm.activeServer;
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
            if ($routeParams.hashKey && $routeParams.hashKey !== 'new') {
                return organizationService.getCachedOrganization($routeParams.hashKey)
                    .then(intitializeRelatedData, function (error) {
                        logError(error);
                    });
            } else if ($routeParams.id) {
                var resourceId = vm.activeServer.baseUrl + '/Organization/' + $routeParams.id;
                return organizationService.getOrganization(resourceId)
                    .then(intitializeRelatedData, function (error) {
                        logError(error);
                    });
            }
            else {
                var data = organizationService.initializeNewOrganization();
                intitializeRelatedData(data)
                vm.title = 'Add New Organization';
                vm.isEditing = false;
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

        }
    }
})();