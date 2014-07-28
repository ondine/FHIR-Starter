(function () {
    'use strict';

    var controllerId = 'organizations';

    angular.module('FHIRStarter').controller(controllerId,
        ['$location', 'common', 'config', 'organizationService', organizations]);

    function organizations($location, common, config, organizationService) {
        var vm = this;
        var keyCodes = config.keyCodes;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.title = 'Organizations';
        vm.refresh = refresh;
        vm.search = search;
        vm.searchText = '';
        vm.organizations = [];
        vm.organizationsCount = 0;
        vm.organizationsFilteredCount = 0;
        vm.filteredOrganizations = [];
        vm.goToOrganization = goToOrganization;
        vm.pageChanged = pageChanged;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 15
        };

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.organizationsFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () {
                    log('Activated Organization View');
                });
        }

        function getOrganizationsCount() {

        }

        function getOrganizationsFilteredCount() {

        }

        function getOrganizations() {
            if (vm.searchText.length > 0)
                return organizationService.search(vm.searchText)
                    .then(function (data) {
                        return vm.organizations = data;
                    });
        }

        function goToOrganization(organization) {
            if (organization && organization.$$hashKey) {
                $location.path('/organization/' + organization.$$hashKey);
            }
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

        function pageChanged(page) {
            if (!page) {
                return;
            }
            vm.paging.currentPage = page;
            getOrganizations();
        }

        function applyFilter() {
            vm.filteredOrganizations = vm.organizations.filter(organizationFilter);
        }

        function organizationFilter(organization) {
            var isMatch = vm.searchText
                ? common.textContains(organization.name, vm.searchText)
                : true;
            return isMatch;
        }
    }
})();
