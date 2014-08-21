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

    var controllerId = 'humanName';

    angular.module('FHIRStarter').controller(controllerId, ['$scope', 'common', 'humanNameService', humanName]);

    function humanName($scope, common, humanNameService) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');

        vm.addToList = addToList;
        vm.editListItem = editListItem;
        vm.humanName = {};
        vm.humanNames = [];
        vm.mode = 'multi';
        vm.removeListItem = removeListItem;
        vm.reset = reset;
        vm.updateName = updateName;

        activate();

        function activate() {
            common.activateController([getHumanNames(), getMode(), initName()], controllerId)
                .then(function () {
                    if (vm.humanNames.length > 0 && vm.mode === 'single') {
                        vm.humanName = vm.humanNames[0];
                    } else {
                        vm.humanName = { "use": "usual"};
                    }
                });
        }

        function addToList(form, item) {
            if (form.$valid) {
                humanNameService.add(item);
                vm.humanNames = humanNameService.getAll();
                initName();
                form.$setPristine();
            }
        }

        function editListItem(item) {
            vm.humanName = item;
        }

        function getHumanNames() {
            vm.humanNames = humanNameService.getAll();
        }

        function getMode() {
            return vm.mode = humanNameService.getMode();
        }

        function initName() {
            if (vm.mode === 'single' && vm.humanNames.length > 0) {
                return vm.humanName = vm.humanNames[0];
            } else {
                return vm.humanName = { "use": "usual"};
            }
        }

        function removeListItem(item) {
            vm.humanNames = humanNameService.remove(item);
        }

        function reset(form) {
            initName();
            form.$setPristine();
        }

        function updateName() {
            if (vm.mode === 'single') {
                humanNameService.setSingle(vm.humanName);
            }
        }
    }
})();
