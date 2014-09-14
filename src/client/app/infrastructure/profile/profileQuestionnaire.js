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

    function profileQuestionnaire($routeParams, $window, common, profileService) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var logInfo = common.logger.getLogFn(controllerId, 'info');
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var logWarning = common.logger.getLogFn(controllerId, 'warning');

        vm.answers = {};
        vm.busyMessage = "Rendering profile questionnaire ...";
        vm.cancel = cancel;
        vm.activate = activate;
        vm.getTitle = getTitle;
        vm.goBack = goBack;
        vm.isBusy = false;
        vm.isSaving = false;
        vm.isEditing = true;
        vm.isRendered = false;
        vm.questionnaire = undefined;
        vm.questionnaireIdParameter = $routeParams.hashKey;
        vm.renderForm = renderForm;
        vm.save = save;
        vm.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };
        vm.title = 'questionnaireDetail';
        vm.updateAnswers = updateAnswers;

        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });

        Object.defineProperty(vm, 'canDelete', {
            get: canDelete
        });

        Object.defineProperty(vm, 'rendered', {
            get: isRendered
        });

        activate();

        function activate() {
            common.activateController([getRequestedQuestionnaire()], controllerId);
        }

        function cancel() {
            vm.isRendered = false;
        }

        function canDelete() {
            return !vm.isEditing;
        }

        function canSave() {
            return !vm.isSaving;
        }

        function getRequestedQuestionnaire() {
            vm.busyMessage = "Rendering profile questionnaire ...";
            toggleSpinner(true);
            var key = $routeParams.hashKey;
            profileService.getProfileQuestionnaire(key)
                .then(function (data) {
                    toggleSpinner(false);
                    vm.questionnaire = data;
                    vm.answers.resourceType = "QuestionnaireAnswers";
                    vm.answers.questionnaire = vm.questionnaire.resourceType;
                    vm.answers.status = {code: "inprogress", display: "in progress", system: "http://hl7.org/fhir/questionnaire-answers-status"};
                    vm.answers.authored = new Date().toISOString();
                    vm.answers.group = {};
                    vm.answers.group.title = vm.questionnaire.group.title;
                    vm.answers.group.linkId = vm.questionnaire.group.linkId;
                    vm.answers.group.text = vm.questionnaire.group.text;
                    vm.answers.group.subject = ''; // reference to patient here
                    if (angular.isArray(vm.questionnaire.group.group)) {
                        vm.answers.group.group = [];
                    } else {
                        vm.answers.group.group = {};
                    }
                    return vm.questionnaire;
                }, function (error) {
                    toggleSpinner(false);
                    if (error.outcome && error.status) {
                        logError(error.status + ' error: ' + error.outcome.issue[0].details);
                    } else {
                        logError("Unknown error: " + error);
                    }
                }).then(renderForm);
        }

        function getTitle() {
            return 'Edit ' + ((vm.questionnaire && vm.questionnaire.fullName) || '');
        }

        function goBack() {
            $window.history.back();
        }

        function isRendered() {
            return vm.isRendered;
        }

        function prepResource(obj) {
            var vals = _.values(obj);
            var keys = _.keys(obj);
            var fhirResource = vals[0];
            fhirResource.resourceType = keys[0];
            return fhirResource;
        }

        function processResult(results) {
            toggleSpinner(false);
            var resourceVersionId = results.headers.location || results.headers["content-location"];
            if (angular.isUndefined(resourceVersionId)) {
                logWarning("Answers saved, but remote location is unavailable. CORS not implemented correctly at remote host.");
            } else {
                logSuccess("Answers saved at " + resourceVersionId);
            }
            vm.location.resourceVersionId = resourceVersionId;
            vm.location.fullName = location.name;
            vm.isEditing = true;
            getTitle();
        }

        function renderForm() {
            vm.isRendered = true;
        }

        function save() {
            vm.busyMessage = "Sending answers to remote host ...";
            toggleSpinner(true);
   //         var fhirResource = prepResource(vm.answers);
            profileService.addAnswer(vm.answers)
                .then(processResult,
                function (error) {
                    toggleSpinner(false);
                    logError(common.unexpectedOutcome(error));
                });
        }

        function toggleSpinner(on) {
            vm.isBusy = on;
        }

        function updateAnswers(model, value) {
            logInfo(model + " updated to " + value);
        }
    }
})();