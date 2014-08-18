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

    var controllerId = 'profileDetail';

    angular.module('FHIRStarter').controller(controllerId,
        ['$location', '$routeParams', '$window', 'common', 'profileService', profileDetail]);

    function profileDetail($location, $routeParams, $window, common, profileService) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');

        vm.cancel = cancel;
        vm.activate = activate;
        vm.getTitle = getTitle;
        vm.goBack = goBack;
        vm.isSaving = false;
        vm.isEditing = true;
        vm.profile = undefined;
        vm.profileIdParameter = $routeParams.hashKey;
        vm.makeQuestionnaire = makeQuestionnaire;
        vm.save = save;
        vm.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };
        vm.title = 'profileDetail';

        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });

        Object.defineProperty(vm, 'canDelete', {
            get: canDelete
        });

        activate();

        function activate() {
            common.activateController([getRequestedProfile()], controllerId);
        }

        function cancel() {

        }

        function canDelete() {
            return !vm.isEditing;
        }

        function canSave() {
            return !vm.isSaving;
        }

        function getRequestedProfile() {
            var val = $routeParams.hashKey;
            if (val !== 'new') {
                profileService.getCachedProfile(val)
                .then(function(data) {
                    return vm.profile = data;
                }, function(error) {
                    logError(error);
                });
            }
        }

        function getTitle() {
            return 'Edit ' + ((vm.profile && vm.profile.fullName) || '');
        }

        function goBack() {
            $window.history.back();
        }

        function makeQuestionnaire(profile) {
            if (profile && profile.$$hashKey) {
                $location.path('/profile/questionnaire/' + profile.$$hashKey);
            }
        }

        function save() {

        }
    }
})();