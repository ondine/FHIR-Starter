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

    var controllerId = 'qualification';

    angular.module('FHIRStarter').controller(controllerId, ['$scope', 'common', 'qualificationService', qualification]);

    function qualification($scope, common, qualificationService) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');

        vm.addToList = addToList;
        vm.editListItem = editListItem;
        vm.qualification = null;
        vm.qualifications = [];
        vm.removeListItem = removeListItem;
        vm.reset = reset;

        activate();

        function activate() {
            common.activateController([getQualifications()], controllerId)
                .then(function () {

                });
        }

        function addToList(form, item) {
            if (form.$valid) {
                qualificationService.add(item);
                vm.qualifications = qualificationService.getAll();
                vm.qualification = null;
                form.$setPristine();
            }
        }

        function editListItem(item) {
            vm.qualification = item;
        }

        function getQualifications() {
            vm.qualifications = qualificationService.getAll();
        }

        function removeListItem(item) {
            qualificationService.remove(item);
            vm.qualifications = qualificationService.getAll();
        }

        function reset(form) {
            vm.qualification = null;
            form.$setPristine();
        }
    }
})();
