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

    var controllerId = 'compositionDetail';

    angular.module('FHIRStarter').controller(controllerId,
        ['$routeParams', '$window', 'common', 'compositionService', compositionDetail]);

    function compositionDetail($routeParams, $window, common, compositionService) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');

        vm.cancel = cancel;
        vm.activate = activate;
        vm.getTitle = getTitle;
        vm.goBack = goBack;
        vm.isSaving = false;
        vm.isEditing = true;
        vm.composition = undefined;
        vm.compositionIdParameter = $routeParams.hashKey;
        vm.save = save;
        vm.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };
        vm.title = 'compositionDetail';

        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });

        Object.defineProperty(vm, 'canDelete', {
            get: canDelete
        });

        activate();

        function activate() {
            common.activateController([getRequestedComposition()], controllerId);
        }

        function cancel() {

        }

        function canDelete() {
            return !vm.isEditing;
        }

        function canSave() {
            return !vm.isSaving;
        }

        function getRequestedComposition() {
            var val = $routeParams.hashKey;
            if (val !== 'new') {
                return compositionService.getCachedComposition(val)
                .then(function(data) {
                    vm.composition = data;
                }, function(error) {
                    logError(error);
                });
            }
        }

        function getTitle() {
            return 'Edit ' + ((vm.composition && vm.composition.fullName) || '');
        }

        function goBack() {
            $window.history.back();
        }

        function save() {

        }
    }
})();