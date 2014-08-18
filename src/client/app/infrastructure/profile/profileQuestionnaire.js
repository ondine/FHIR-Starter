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

    var controllerId = 'profileQuestionnaire';

    angular.module('FHIRStarter').controller(controllerId,
        ['$routeParams', '$window', 'common', 'profileService', 'questionnaireService', profileQuestionnaire]);

    function profileQuestionnaire($routeParams, $window, common, profileService, questionnaireService) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var logWarning = common.logger.getLogFn(controllerId, 'warning');

        vm.cancel = cancel;
        vm.activate = activate;
        vm.getTitle = getTitle;
        vm.goBack = goBack;
        vm.isSaving = false;
        vm.isEditing = true;
        vm.questionnaire = undefined;
        vm.questionnaireIdParameter = $routeParams.hashKey;
        vm.renderForm = renderForm;
        vm.save = save;
        vm.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };
        vm.title = 'questionnaireDetail';

        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });

        Object.defineProperty(vm, 'canDelete', {
            get: canDelete
        });

        activate();

        function activate() {
            common.activateController([getRequestedQuestionnaire()], controllerId);
        }

        function cancel() {

        }

        function canDelete() {
            return !vm.isEditing;
        }

        function canSave() {
            return !vm.isSaving;
        }

        function getRequestedQuestionnaire() {
            var key = $routeParams.hashKey;
            profileService.getProfileQuestionnaire(key)
                .then(function (data) {
                    return vm.questionnaire = data;
                }, function (error) {
                    if (error.outcome && error.status) {
                        logError(error.status + ' error: ' + error.outcome.issue[0].details);
                    } else {
                        logError("Unknown error: " + error);
                    }
                });
        }

        function getTitle() {
            return 'Edit ' + ((vm.questionnaire && vm.questionnaire.fullName) || '');
        }

        function goBack() {
            $window.history.back();
        }

        function renderForm(formData) {
            logWarning("Whoops! TODO: add functionality produce a live form...")
        }

        function save() {

        }
    }
})();