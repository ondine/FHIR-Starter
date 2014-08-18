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

    var controllerId = 'profiles';

    angular.module('FHIRStarter').controller(controllerId,
        ['$location', 'common', 'config', 'fhirServers', 'profileService', profiles]);

    function profiles($location, common, config, fhirServers, profileService) {
        var vm = this;
        var applyFilter = function () {
        };
        var getLogFn = common.logger.getLogFn;
        var keyCodes = config.keyCodes;
        var logError = getLogFn(controllerId, "error");
        var logWarning = getLogFn(controllerId, "warning");

        vm.activeServer = null;
        vm.busyMessage = "Contacting remote server ...";
        vm.filteredProfiles = [];
        vm.profilesFilteredCount = 0;
        vm.isBusy = false;
        vm.goToProfile = goToProfile;
        vm.profiles = [];
        vm.profilesCount = 0;
        vm.profilesFilter = profileFilter;
        vm.profilesSearch = '';
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
        vm.title = 'Profiles';

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.profilesFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
            common.activateController([getActiveServer()], controllerId)
                .then(function () {
                    getProfiles(false);
                }, function (error) {
                    log('Error ' + error);
                })
                .then(function () {
                    applyFilter = common.createSearchThrottle(vm, 'profiles');
                    if (vm.profilesSearch) {
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

        function getProfilesFilteredCount() {
            return profileService.getFilteredCount(vm.profilesFilter)
                .then(function (data) {
                    vm.profilesFilteredCount = data;
                });
        }

        function getProfilesCount() {
            return profileService.getProfilesCount()
                .then(function (data) {
                    if (data === 0) {
                        logWarning("No Profiles available from remote server.")
                    }
                    return vm.profilesCount = data;
                });
        }

        function getProfiles(forceRefresh) {
            toggleSpinner(true);
            return profileService.getProfiles(forceRefresh, vm.activeServer.baseUrl, vm.paging.currentPage, vm.paging.pageSize, vm.profilesFilter)
                .then(function (data) {
                    vm.profiles = data;
                    getProfilesFilteredCount();
                    if (!vm.profilesCount || forceRefresh) {
                        getProfilesCount();
                    }
                    toggleSpinner(false);
                    return data;
                }, function (error) {
                    toggleSpinner(false);
                    logError('Failed retrieving Profiles from remote server. Error code: ' + error.status + '\n' + error.outcome);
                    return error;
                });
        }

        function goToProfile(profile) {
            if (profile && profile.$$hashKey) {
                $location.path('/profile/' + profile.$$hashKey);
            }
        }

        function profileFilter(profile) {
            var textContains = common.textContains;
            var searchText = vm.profilesSearch;
            var isMatch = searchText ?
                textContains(profile.content.name, searchText)
                : true;
            return isMatch;
        }

        function pageChanged() {
            getProfiles(false);
        }

        function refresh() {
            getProfiles(true);
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.profilesSearch = '';
            }
            getProfiles();
        }

        function toggleSpinner(on) {
            vm.isBusy = on;
        }
    }
})();
