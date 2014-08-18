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

    var controllerId = 'valuesets';

    angular.module('FHIRStarter').controller(controllerId,
        ['$location', 'common', 'config', 'fhirServers', 'valuesetService', valuesets]);

    function valuesets($location, common, config, fhirServers, valuesetService) {
        var vm = this;
        var applyFilter = function () {
        };
        var getLogFn = common.logger.getLogFn;
        var keyCodes = config.keyCodes;
        var log = getLogFn(controllerId);

        vm.activeServer = null;
        vm.busyMessage = "Contacting remote server ...";
        vm.filteredValuesets = [];
        vm.valuesetsFilteredCount = 0;
        vm.isBusy = false;
        vm.goToValueset = goToValueset;
        vm.valuesets = [];
        vm.valuesetsCount = 0;
        vm.valuesetsFilter = valuesetFilter;
        vm.valuesetsSearch = '';
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
        vm.title = 'ValueSets';

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.valuesetsFilteredCount / vm.paging.pageSize) + 1;
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
                    applyFilter = common.createSearchThrottle(vm, 'valuesets');
                    if (vm.valuesetsSearch) {
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
            return valuesetService.getFilteredCount(vm.valuesetsFilter)
                .then(function (data) {
                    vm.valuesetsFilteredCount = data;
                });
        }

        function getValuesetsCount() {
            return valuesetService.getValuesetsCount()
                .then(function (data) {
                    return vm.valuesetsCount = data;
                });
        }

        function getValuesets(forceRefresh) {
            toggleSpinner(true);
            return valuesetService.getValuesets(forceRefresh, vm.activeServer.baseUrl, vm.paging.currentPage, vm.paging.pageSize, vm.valuesetsFilter)
                .then(function (data) {
                    vm.valuesets = data;
                    getValuesetsFilteredCount();
                    if (!vm.valuesetsCount || forceRefresh) {
                        getValuesetsCount();
                    }
                    toggleSpinner(false);
                    return data;
                }, function (error) {
                    toggleSpinner(false);
                    return error;
                });
        }

        function goToValueset(valueset) {
            if (valueset && valueset.$$hashKey) {
                $location.path('/valueset/' + valueset.$$hashKey);
            }
        }

        function valuesetFilter(valueset) {
            var textContains = common.textContains;
            var searchText = vm.valuesetsSearch;
            var isMatch = searchText ?
                textContains(valueset.content.name, searchText)
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
                vm.valuesetsSearch = '';
            }
            getValuesets();
        }

        function toggleSpinner(on) {
            vm.isBusy = on;
        }
    }
})();
