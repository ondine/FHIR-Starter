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
        vm.filteredValuesets = [];
        vm.profilesFilteredCount = 0;
        vm.isBusy = false;
        vm.goToValueset = goToValueset;
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
                    getValuesets(false);
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

        function getValuesetsFilteredCount() {
            return profileService.getFilteredCount(vm.profilesFilter)
                .then(function (data) {
                    vm.profilesFilteredCount = data;
                });
        }

        function getValuesetsCount() {
            return profileService.getValuesetsCount()
                .then(function (data) {
                    return vm.profilesCount = data;
                });
        }

        function getValuesets(forceRefresh) {
            toggleSpinner(true);
            return profileService.getValuesets(forceRefresh, vm.activeServer.baseUrl, vm.paging.currentPage, vm.paging.pageSize, vm.profilesFilter)
                .then(function (data) {
                    vm.profiles = data;
                    getValuesetsFilteredCount();
                    if (!vm.profilesCount || forceRefresh) {
                        getValuesetsCount();
                    }
                    toggleSpinner(false);
                    return data;
                }, function (error) {
                    toggleSpinner(false);
                    return error;
                });
        }

        function goToValueset(profile) {
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
            getValuesets(false);
        }

        function refresh() {
            getValuesets(true);
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.profilesSearch = '';
            }
            getValuesets();
        }

        function toggleSpinner(on) {
            vm.isBusy = on;
        }
    }
})();
