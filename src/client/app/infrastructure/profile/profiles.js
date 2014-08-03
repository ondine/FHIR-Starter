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
        var log = getLogFn(controllerId);

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
