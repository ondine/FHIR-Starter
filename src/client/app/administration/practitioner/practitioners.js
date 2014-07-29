(function () {
    'use strict';

    var controllerId = 'practitioners';

    angular.module('FHIRStarter').controller(controllerId,
        ['$location', 'common', 'config', 'fhirServers', 'practitionerService', practitioners]);

    function practitioners($location, common, config, fhirServers, practitionerService) {
        var getLogFn = common.logger.getLogFn;
        var keyCodes = config.keyCodes;
        var log = getLogFn(controllerId);
        var vm = this;

        vm.activeServer = null;
        vm.busyMessage = "Contacting remote server ...";
        vm.filteredPractitioners = [];
        vm.filteredPractitionersCount = 0;
        vm.isBusy = false;
        vm.goToPractitioner = goToPractitioner;
        vm.practitioners = [];
        vm.practitionersCount = 0;
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
        vm.title = 'Practitioners';

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.paging.totalResults / vm.paging.pageSize) + 1;
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
            vm.filteredPractitioners = vm.practitioners.filter(practitionerFilter);
        }

        function getActiveServer() {
            fhirServers.getActiveServer()
                .then(function (server) {
                    return vm.activeServer = server;
                });
        }

        function getPractitionersFilteredCount() {
            // TODO: filter results based on doB or address, etc.
        }

        function fetchLinkedPage(url) {
            if (url.length > 0) {
                toggleSpinner(true);
                practitionerService.getLink(url)
                    .then(function (data) {
                        log('Returned ' + (angular.isArray(data.entry) ? data.entry.length : 0) + ' Practitioners from ' + vm.activeServer.name, true);
                        return data;
                    })
                    .then(processSearchResults)
                    .then(function () {
                        toggleSpinner(false);
                    });
            }
        }

        function goToPractitioner(practitioner) {
            if (practitioner && practitioner.$$hashKey) {
                $location.path('/practitioner/' + practitioner.$$hashKey);
            }
        }

        function practitionerFilter(practitioner) {
            var isMatch = vm.searchText
                ? common.textContains(practitioner.name, vm.searchText)
                : true;
            return isMatch;
        }

        function pageChanged() {
            getPractitioners();
        }

        function processSearchResults(searchResults) {
            vm.practitioners = searchResults.entry;
            vm.paging.links = searchResults.link;
            vm.paging.totalResults = searchResults.totalResults;
        }

        function refresh() {

        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.searchText = '';
            } else if ($event.keyCode === keyCodes.enter || $event.type === 'click') {
                vm.paging.currentPage = 1;
                getPractitioners();
            }
        }

        function getPractitioners() {
            if (vm.searchText.length > 0) {
                toggleSpinner(true);
                practitionerService.getPractitioners(vm.activeServer.baseUrl, vm.searchText, vm.paging.currentPage, vm.paging.pageSize)
                    .then(function (data) {
                        log('Returned ' + (angular.isArray(data.entry) ? data.entry.length : 0) + ' Practitioners from ' + vm.activeServer.name, true);
                        return data;
                    }, function (error) {
                        log('Error ' + error);
                        toggleSpinner(false);
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
