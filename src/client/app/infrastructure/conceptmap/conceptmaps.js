(function () {
    'use strict';

    var controllerId = 'conceptmaps';

    angular.module('FHIRStarter').controller(controllerId,
        ['$location', 'common', 'config', 'fhirServers', 'conceptmapService', conceptmaps]);

    function conceptmaps($location, common, config, fhirServers, conceptmapService) {
        var vm = this;
        var applyFilter = function () {
        };
        var getLogFn = common.logger.getLogFn;
        var keyCodes = config.keyCodes;
        var log = getLogFn(controllerId);

        vm.activeServer = null;
        vm.busyMessage = "Contacting remote server ...";
        vm.filteredValuesets = [];
        vm.conceptmapsFilteredCount = 0;
        vm.isBusy = false;
        vm.goToValueset = goToValueset;
        vm.conceptmaps = [];
        vm.conceptmapsCount = 0;
        vm.conceptmapsFilter = conceptmapFilter;
        vm.conceptmapsSearch = '';
        vm.pageChanged = pageChanged;
        vm.paging = {
            currentPage: 1,
            links: null,
            maxPagesToShow: 10,
            pageSize: 20,
            totalResults: 0
        };
        vm.refresh = refresh;
        vm.search = search;
        vm.title = 'ConceptMaps';

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.conceptmapsFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
            common.activateController([getActiveServer()], controllerId)
                .then(function () {
                    getValuesets(false);
                }, function (error) {
                    log('Error ' + error);
                })
                .then(function () {
                    applyFilter = common.createSearchThrottle(vm, 'conceptmaps');
                    if (vm.conceptmapsSearch) {
                        applyFilter(true);
                    }
                });
        }

        function getActiveServer() {
            fhirServers.getActiveServer()
                .then(function (server) {
                    return vm.activeServer = server;
                });
        }

        function getValuesetsFilteredCount() {
            return conceptmapService.getFilteredCount(vm.conceptmapsFilter)
                .then(function (data) {
                    vm.conceptmapsFilteredCount = data;
                });
        }

        function getValuesetsCount() {
            return conceptmapService.getValuesetsCount()
                .then(function (data) {
                    return vm.conceptmapsCount = data;
                });
        }

        function getValuesets(forceRefresh) {
            toggleSpinner(true);
            return conceptmapService.getValuesets(forceRefresh, vm.activeServer.baseUrl, vm.paging.currentPage, vm.paging.pageSize, vm.conceptmapsFilter)
                .then(function (data) {
                    vm.conceptmaps = data;
                    getValuesetsFilteredCount();
                    if (!vm.conceptmapsCount || forceRefresh) {
                        getValuesetsCount();
                    }
                    toggleSpinner(false);
                    return data;
                }, function (error) {
                    toggleSpinner(false);
                    return error;
                });
        }

        function goToValueset(conceptmap) {
            if (conceptmap && conceptmap.$$hashKey) {
                $location.path('/conceptmap/' + conceptmap.$$hashKey);
            }
        }

        function conceptmapFilter(conceptmap) {
            var textContains = common.textContains;
            var searchText = vm.conceptmapsSearch;
            var isMatch = searchText ?
                textContains(conceptmap.content.name, searchText)
                : true;
            return isMatch;
        }

        function pageChanged() {
            getValuesets(false);
        }

        function refresh() {
            getValuesets(true);
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.conceptmapsSearch = '';
            }
            getValuesets();
        }

        function toggleSpinner(on) {
            vm.isBusy = on;
        }
    }
})();
