(function () {
    'use strict';

    var controllerId = 'organizationDetail';

    angular.module('FHIRStarter').controller(controllerId,
        ['$location', '$routeParams', '$window', 'addressService', 'common', 'fhirServers', 'identifierService', 'localValueSets', 'organizationService', organizationDetail]);

    function organizationDetail($location, $routeParams, $window, addressService, common, fhirServers, identifierService, localValueSets, organizationService) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');

        vm.activeServer;
        vm.cancel = cancel;
        vm.activate = activate;
        vm.contactTypes = undefined;
        vm.delete = deleteOrganization;
        vm.edit = edit;
        vm.getTitle = getTitle;
        vm.goBack = goBack;
        vm.isSaving = false;
        vm.isEditing = true;
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
            common.activateController([getActiveServer(), getOrganizationTypes(), getContactTypes(), getStates()], controllerId).then(function () {
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

        function getContactTypes() {
            vm.contactTypes = localValueSets.contactEntityType();
        }

        function getOrganizationTypes() {
            vm.organizationTypes = localValueSets.organizationType();
        }

        function getRequestedOrganization() {
            if ($routeParams.hashKey && $routeParams.hashKey !== 'new') {
                return organizationService.getCachedOrganization($routeParams.hashKey)
                    .then(function (data) {
                        vm.organization = data;
                        if (angular.isUndefined(vm.organization.type)) {
                            vm.organization.type =  { "coding": [] }
                        }
                        vm.title = vm.organization.name;
                        identifierService.init(vm.organization.identifier);
                        addressService.init(vm.organization.address);
                    }, function (error) {
                        logError(error);
                    });
            } else if ($routeParams.id) {
                var resourceId = vm.activeServer.baseUrl + '/Organization/' + $routeParams.id;
                return organizationService.getOrganization(resourceId)
                    .then(function (data) {
                        vm.organization = data;
                        if (angular.isUndefined(vm.organization.type)) {
                            vm.organization.type =  { "coding": [] }
                        }
                        vm.title = vm.organization.name;
                        identifierService.init(vm.organization.identifier);
                        addressService.init(vm.organization.address);
                    }, function (error) {
                        logError(error);
                    });
            }
            else {
                vm.organization = organizationService.initializeNewOrganization();
                vm.title = 'Add New Organization';
                vm.isEditing = false;
            }
        }

        function getStates() {
            vm.states = localValueSets.usaStates();
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