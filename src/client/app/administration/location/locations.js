(function () {
    'use strict';

    var controllerId = 'locations';

    angular.module('FHIRStarter').controller(controllerId,
        ['$location', 'common', 'config', 'fhirServers', 'locationService', locations]);

    function locations($location, common, config, fhirServers, locationService) {
        var getLogFn = common.logger.getLogFn;
        var keyCodes = config.keyCodes;
        var logInfo = getLogFn(controllerId, 'info');
        var logError = getLogFn(controllerId, 'error');
        var vm = this;

        vm.activeServer = null;
        vm.busyMessage = "Contacting remote server ...";
        vm.filteredLocations = [];
        vm.filteredLocationsCount = 0;
        vm.isBusy = false;
        vm.goToDetail = goToDetail;
        vm.locations = [];
        vm.locationsCount = 0;
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
        vm.title = 'Locations';

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
            vm.filteredLocations = vm.locations.filter(locationFilter);
        }

        function getCachedSearchResults() {
            locationService.getCachedSearchResults()
                .then(processSearchResults);
        }

        function getActiveServer() {
            fhirServers.getActiveServer()
                .then(function (server) {
                    return vm.activeServer = server;
                });
        }

        function getLocationsFilteredCount() {
            // TODO: filter results based on name.
        }

        function goToDetail(hashKey) {
            if (hashKey) {
                $location.path('/location/view/' + hashKey);
            }
        }

        function locationFilter(location) {
            var isMatch = vm.searchText
                ? common.textContains(location.name, vm.searchText)
                : true;
            return isMatch;
        }

        function pageChanged() {
            getLocations();
        }

        function processSearchResults(searchResults) {
            if (searchResults) {
                vm.locations = (searchResults.entry || []);
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
                getLocations();
            }
        }

        function getLocations() {
            if (vm.searchText.length > 0) {
                toggleSpinner(true);
                locationService.getLocations(vm.activeServer.baseUrl, vm.searchText, vm.paging.currentPage, vm.paging.pageSize)
                    .then(function (data) {
                        logInfo('Returned ' + (angular.isArray(data.entry) ? data.entry.length : 0) + ' Locations from ' + vm.activeServer.name, true);
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
