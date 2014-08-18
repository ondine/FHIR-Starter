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

    var controllerId = 'telecom';

    angular.module('FHIRStarter').controller(controllerId, ['common', 'telecomService', telecom]);

    function telecom(common, telecomService) {
        var vm = this;

        vm.addToList = addToList;
        vm.editListItem = editListItem;
        vm.telecom = { purpose: { coding: []}};
        vm.telecoms = [];
        vm.removeListItem = removeListItem;
        vm.reset = reset;
        vm.showHome = true;
        vm.showMobile = true;

        activate();

        function activate() {
            common.activateController([getTelecoms(), supportHome(), supportMobile()], controllerId).then(function () {
                vm.telecom = { "use": "work"};
            });
        }

        function addToList(form, item) {
            if (form.$valid) {
                telecomService.add(item);
                vm.telecoms = telecomService.getAll();
                vm.telecom = {};
                form.$setPristine();
            }
        }

        function editListItem(item) {
            vm.telecom = item;
        }

        function getTelecoms() {
            vm.telecoms = telecomService.getAll();
        }

        function removeListItem(item) {
            telecomService.remove(item);
            vm.telecoms = telecomService.getAll();
        }

        function reset(form) {
            form.$setPristine();
            vm.telecom = { "use": "work"};
        }

        function supportHome() {
            return vm.showHome = telecomService.supportHome();
        }

        function supportMobile() {
            return vm.showMobile = telecomService.supportMobile();
        }
    }
})();
