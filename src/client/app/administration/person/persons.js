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

    var controllerId = 'persons';

    angular.module('FHIRStarter').controller(controllerId,
        ['$location', 'common', 'config', 'fhirServers', 'personService', persons]);

    function persons($location, common, config, fhirServers, personService) {
        var getLogFn = common.logger.getLogFn;
        var keyCodes = config.keyCodes;
        var log = getLogFn(controllerId);
        var vm = this;

        vm.activeServer = null;
        vm.busyMessage = "Contacting remote server ...";
        vm.filteredPersons = [];
        vm.filteredPersonsCount = 0;
        vm.isBusy = false;
        vm.goToPerson = goToPerson;
        vm.persons = [];
        vm.personsCount = 0;
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
        vm.title = 'Persons';

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
            vm.filteredPersons = vm.persons.filter(personFilter);
        }

        function getActiveServer() {
            fhirServers.getActiveServer()
                .then(function (server) {
                    return vm.activeServer = server;
                });
        }

        function getPersonsFilteredCount() {
            // TODO: filter results based on doB or address, etc.
        }

        function goToPerson(person) {
            if (person && person.$$hashKey) {
                $location.path('/person/' + person.$$hashKey);
            }
        }

        function personFilter(person) {
            var isMatch = vm.searchText
                ? common.textContains(person.name, vm.searchText)
                : true;
            return isMatch;
        }

        function pageChanged() {
            getPersons();
        }

        function processSearchResults(searchResults) {
            vm.persons = searchResults.entry;
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
                getPersons();
            }
        }

        function getPersons() {
            if (vm.searchText.length > 0) {
                toggleSpinner(true);
                personService.getPersons(vm.activeServer.baseUrl, vm.searchText, vm.paging.currentPage, vm.paging.pageSize)
                    .then(function (data) {
                        log('Returned ' + (angular.isArray(data.entry) ? data.entry.length : 0) + ' Persons from ' + vm.activeServer.name, true);
                        return data;
                    }, function(error) {
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
