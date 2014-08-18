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

    var controllerId = 'questionnaires';

    angular.module('FHIRStarter').controller(controllerId,
        ['$location', 'common', 'config', 'fhirServers', 'questionnaireService', questionnaires]);

    function questionnaires($location, common, config, fhirServers, questionnaireService) {
        var vm = this;
        var applyFilter = function () {
        };
        var getLogFn = common.logger.getLogFn;
        var keyCodes = config.keyCodes;
        var log = getLogFn(controllerId);

        vm.activeServer = null;
        vm.busyMessage = "Contacting remote server ...";
        vm.filteredQuestionnaires = [];
        vm.questionnairesFilteredCount = 0;
        vm.isBusy = false;
        vm.goToQuestionnaire = goToQuestionnaire;
        vm.questionnaires = [];
        vm.questionnairesCount = 0;
        vm.questionnairesFilter = questionnaireFilter;
        vm.questionnairesSearch = '';
        vm.pageChanged = pageChanged;
        vm.paging = {
            currentPage: 1,
            links: null,
            maxPagesToShow: 5,
            pageSize: 12,
            totalResults: 0
        };
        vm.refresh = refresh;
        vm.search = search;
        vm.title = 'Questionnaires';

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.questionnairesFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
            common.activateController([getActiveServer()], controllerId)
                .then(function () {
                    getQuestionnaires(false);
                }, function (error) {
                    log('Error ' + error);
                })
                .then(function () {
                    applyFilter = common.createSearchThrottle(vm, 'questionnaires');
                    if (vm.questionnairesSearch) {
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

        function getQuestionnairesFilteredCount() {
            return questionnaireService.getFilteredCount(vm.questionnairesFilter)
                .then(function (data) {
                    vm.questionnairesFilteredCount = data;
                });
        }

        function getQuestionnairesCount() {
            return questionnaireService.getQuestionnairesCount()
                .then(function (data) {
                    return vm.questionnairesCount = data;
                });
        }

        function getQuestionnaires(forceRefresh) {
            toggleSpinner(true);
            return questionnaireService.getQuestionnaires(forceRefresh, vm.activeServer.baseUrl, vm.paging.currentPage, vm.paging.pageSize, vm.questionnairesFilter)
                .then(function (data) {
                    vm.questionnaires = data;
                    getQuestionnairesFilteredCount();
                    if (!vm.questionnairesCount || forceRefresh) {
                        getQuestionnairesCount();
                    }
                    toggleSpinner(false);
                    return data;
                }, function (error) {
                    toggleSpinner(false);
                    return error;
                });
        }

        function goToQuestionnaire(questionnaire) {
            if (questionnaire && questionnaire.$$hashKey) {
                $location.path('/questionnaire/' + questionnaire.$$hashKey);
            }
        }

        function questionnaireFilter(questionnaire) {
            var textContains = common.textContains;
            var searchText = vm.questionnairesSearch;
            var isMatch = searchText ?
                textContains((questionnaire.title || ''), searchText)
                    || textContains(questionnaire.content.status, searchText)
                : true;
            return isMatch;
        }

        function pageChanged() {
            getQuestionnaires(false);
        }

        function refresh() {
            getQuestionnaires(true);
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.questionnairesSearch = '';
            }
            getQuestionnaires();
        }

        function toggleSpinner(on) {
            vm.isBusy = on;
        }
    }
})();
