(function () {
    'use strict';

    var controllerId = 'organizations';

    angular.module('FHIRStarter').controller(controllerId,
        ['$location', 'common', 'config', 'fhirServers', 'organizationService', organizations]);

    function organizations($location, common, config, fhirServers, organizationService) {
        var getLogFn = common.logger.getLogFn;
        var keyCodes = config.keyCodes;
        var logInfo = getLogFn(controllerId, 'info');
        var logError = getLogFn(controllerId, 'error');
        var vm = this;

        vm.activeServer = null;
        vm.busyMessage = "Contacting remote server ...";
        vm.filteredOrganizations = [];
        vm.filteredOrganizationsCount = 0;
        vm.isBusy = false;
        vm.goToDetail = goToDetail;
        vm.organizations = [];
        vm.organizationsCount = 0;
        vm.errorOutcome = null;
        vm.pageChanged = pageChanged;
        vm.paging = {
            currentPage: 1,
            links: null,
            maxPagesToShow: 5,
            pageSize: 15,
            totalResults: 0
        };
        vm.refresh = refresh;
        vm.search = search;
        vm.searchResults = null;
        vm.searchText = '';
        vm.title = 'Organizations';

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.paging.totalResults / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
            common.activateController([getActiveServer(), getCachedSearchResults()], controllerId)
                .then(function () {

                });
        }

        function applyFilter() {
            vm.filteredOrganizations = vm.organizations.filter(organizationFilter);
        }

        function getCachedSearchResults() {
            organizationService.getCachedSearchResults()
                .then(processSearchResults);
        }

        function getActiveServer() {
            fhirServers.getActiveServer()
                .then(function (server) {
                    return vm.activeServer = server;
                });
        }

        function getOrganizationsFilteredCount() {
            // TODO: filter results based on name.
        }

        function goToDetail(hashKey) {
            if (hashKey) {
                $location.path('/organization/view/' + hashKey);
            }
        }

        function organizationFilter(organization) {
            var isMatch = vm.searchText
                ? common.textContains(organization.name, vm.searchText)
                : true;
            return isMatch;
        }

        function pageChanged() {
            getOrganizations();
        }

        function processSearchResults(searchResults) {
            if (searchResults) {
                vm.organizations = (searchResults.entry || []);
                vm.paging.links = (searchResults.link || []);
                vm.paging.totalResults = (searchResults.totalResults || 0);
            }
        }

        function refresh() {
           // TODO: refresh search results
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.searchText = '';
            } else if ($event.keyCode === keyCodes.enter || $event.type === 'click') {
                vm.paging.currentPage = 1;
                getOrganizations();
            }
        }

        function getOrganizations() {
            if (vm.searchText.length > 0) {
                toggleSpinner(true);
                organizationService.getOrganizations(vm.activeServer.baseUrl, vm.searchText, vm.paging.currentPage, vm.paging.pageSize)
                    .then(function (data) {
                        logInfo('Returned ' + (angular.isArray(data.entry) ? data.entry.length : 0) + ' Organizations from ' + vm.activeServer.name, true);
                        return data;
                    }, function (error) {
                        toggleSpinner(false);
                        logError((angular.isDefined(error.outcome) ? error.outcome.issue[0].details : error));
                    })
                    .then(processSearchResults)
                    .then(function () {
                        toggleSpinner(false);
                    });
            }
        }

        function toggleSpinner(on) {
            vm.isBusy = on;
        }
    }
})();
