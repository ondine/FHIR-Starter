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

    var controllerId = 'address';

    angular.module('FHIRStarter').controller(controllerId, ['common', 'config', 'addressService', address]);

    function address(common, config, addressService) {
        var vm = this;
        var keyCodes = config.keyCodes;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var $q = common.$q;

        vm.address = {};
        vm.addresses = [];
        vm.addToList = addToList;
        vm.capture = capture;
        vm.editListItem = editListItem;
        vm.getLocation = getLocation;
        vm.loadingLocations = false;
        vm.mode = 'multi';
        vm.removeListItem = removeListItem;
        vm.reset = reset;
        vm.showHome = true;

        activate();

        function activate() {
            common.activateController([getAddresses(), getMode(), supportHome(), initAddress() ], controllerId)
                .then(function () {
                    if (vm.addresses.length > 0 && vm.mode === 'single') {
                        vm.address = vm.addresses[0];
                    }
            });
        }

        function addToList(form, item) {
            if (form.$valid) {
                addressService.add(item);
                vm.addresses = addressService.getAll();
                initAddress();
                form.$setPristine();
            }
        }

        function capture($event, form, item) {
            if (form.$valid) {
                if ($event.keyCode === keyCodes.esc) {
                    initAddress();
                } else if ($event.keyCode === keyCodes.enter) {
                    if (vm.mode === 'single') {
                        addressService.add(item);
                    } else {
                        addToList(form, item);
                    }
                }
            }
        }

        function editListItem(item) {
            vm.address = item;
        }

        function getAddresses() {
            vm.addresses = addressService.getAll();
        }

        function getLocation(input) {
            var deferred = $q.defer();
            vm.loadingLocations = true;
            addressService.searchGoogle(input)
                .then(function (data) {
                    vm.loadingLocations = false;
                    deferred.resolve(data);
                }, function (error) {
                    vm.loadingLocations = false;
                    logError(error);
                    deferred.reject();
                });
            return deferred.promise;
        }

        function getMode() {
            return vm.mode = addressService.getMode();
        }

        function initAddress() {
            if (vm.mode === 'single' && vm.addresses.length > 0) {
                return vm.address = vm.addresses[0];
            } else {
                return vm.address = { "use": "work"};
            }

        }

        function removeListItem(item) {
            addressService.remove(item);
            vm.addresses = addressService.getAll();
        }

        function reset(form) {
            initAddress();
            form.$setPristine();
        }

        function supportHome() {
            return vm.showHome = addressService.supportHome();
        }
    }
})();
