/**
 * Copyright 2014 Peter Bernhardt, et. al.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
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
        vm.filteredConceptmaps = [];
        vm.conceptmapsFilteredCount = 0;
        vm.isBusy = false;
        vm.goToConceptmap = goToConceptmap;
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
                    getConceptmaps(false);
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

        function getConceptmapsFilteredCount() {
            return conceptmapService.getFilteredCount(vm.conceptmapsFilter)
                .then(function (data) {
                    vm.conceptmapsFilteredCount = data;
                });
        }

        function getConceptmapsCount() {
            return conceptmapService.getConceptmapsCount()
                .then(function (data) {
                    return vm.conceptmapsCount = data;
                });
        }

        function getConceptmaps(forceRefresh) {
            toggleSpinner(true);
            return conceptmapService.getConceptmaps(forceRefresh, vm.activeServer.baseUrl, vm.paging.currentPage, vm.paging.pageSize, vm.conceptmapsFilter)
                .then(function (data) {
                    vm.conceptmaps = data;
                    getConceptmapsFilteredCount();
                    if (!vm.conceptmapsCount || forceRefresh) {
                        getConceptmapsCount();
                    }
                    toggleSpinner(false);
                    return data;
                }, function (error) {
                    toggleSpinner(false);
                    return error;
                });
        }

        function goToConceptmap(conceptmap) {
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
            getConceptmaps(false);
        }

        function refresh() {
            getConceptmaps(true);
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.conceptmapsSearch = '';
            }
            getConceptmaps();
        }

        function toggleSpinner(on) {
            vm.isBusy = on;
        }
    }
})();
