(function () {
    'use strict';

    var controllerId = 'organizations';

    angular.module('FHIRStarter').controller(controllerId,
        ['$location', 'common', 'config', 'fhirServers', 'organizationService', organizations]);

    function organizations($location, common, config, fhirServers, organizationService) {
        var getLogFn = common.logger.getLogFn;
        var keyCodes = config.keyCodes;
        var log = getLogFn(controllerId);
        var vm = this;

        vm.activeServer = null;
        vm.busyMessage = "Contacting remote server ...";
        vm.filteredOrganizations = [];
        vm.filteredOrganizationsCount = 0;
        vm.isBusy = false;
        vm.goToOrganization = goToOrganization;
        vm.organizations = [];
        vm.organizationsCount = 0;
        vm.pageChanged = pageChanged;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 15
        };
        vm.refresh = refresh;
        vm.search = search;
        vm.searchText = '';
        vm.title = 'Organizations';

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.filteredOrganizationsCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
            common.activateController([getActiveServer()], controllerId)
                .then(function () {
                    // nothing to do
                });
        }

        function applyFilter() {
            vm.filteredOrganizations = vm.organizations.filter(organizationFilter);
        }

        function getActiveServer() {
            fhirServers.getActiveServer()
                .then(function (server) {
                    return vm.activeServer = server;
                });
        }

        function getOrganizationsCount() {

        }

        function getOrganizationsFilteredCount() {

        }

        function getOrganizations() {
            if (vm.searchText.length > 0) {
                toggleSpinner(true);
                organizationService.search(vm.activeServer.baseUrl, vm.searchText)
                    .then(function (data) {
                        log('Returned ' + (angular.isArray(data) ? data.length : 0) + ' Organizations from ' + vm.activeServer.name, true);
                        return vm.organizations = data;
                    })
                    .then(function () {
                        toggleSpinner(false);
                    });
            }
        }

        function goToOrganization(organization) {
            if (organization && organization.$$hashKey) {
                $location.path('/organization/' + organization.$$hashKey);
            }
        }

        function organizationFilter(organization) {
            var isMatch = vm.searchText
                ? common.textContains(organization.name, vm.searchText)
                : true;
            return isMatch;
        }

        function pageChanged(page) {
            if (!page) {
                return;
            }
            vm.paging.currentPage = page;
            getOrganizations();
        }

        function refresh() {
            getOrganizations();
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.searchText = '';
            } else if ($event.keyCode === keyCodes.enter || $event.type === 'click') {
                getOrganizations();
            }
        }

        function toggleSpinner(on) {
            vm.isBusy = on;
        }
    }
})();
