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

    var controllerId = 'identifier';

    angular.module('FHIRStarter').controller(controllerId, ['$scope', 'common', 'identifierService', identifier]);

    function identifier($scope, common, identifierService) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');

        vm.addToList = addToList;
        vm.editListItem = editListItem;
        vm.genId = generateIdentifier;
        vm.identifier = {};
        vm.identifiers = [];
        vm.mode = 'multi';
        vm.removeListItem = removeListItem;
        vm.reset = reset;
        vm.updateIdentifier = updateIdentifier;

        activate();

        function activate() {
            common.activateController([getIdentifiers(), getMode()], controllerId)
                .then(function () {
                    if (vm.identifiers.length > 0 && vm.mode === 'single') {
                        vm.identifier = vm.identifiers[0];
                    }
                });
        }

        function addToList(form, item) {
            if (form.$valid) {
                identifierService.add(item);
                vm.identifiers = identifierService.getAll();
                vm.identifier = {};
                form.$setPristine();
            }
        }

        function editListItem(item) {
            vm.identifier = item;
        }

        function generateIdentifier() {
            return common.generateUUID();
        }

        function getIdentifiers() {
            vm.identifiers = identifierService.getAll();
        }

        function getMode() {
            return vm.mode = identifierService.getMode();
        }

        function removeListItem(item) {
            identifierService.remove(item);
            vm.identifiers = identifierService.getAll();
        }

        function reset(form) {
            vm.identifier = { "use": "usual"};
            form.$setPristine();
        }

        function updateIdentifier() {
            identifierService.setSingle(vm.identifier);
        }
    }
})();
