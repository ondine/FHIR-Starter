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
        vm.filteredQuestionnairesCount = 0;
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
            maxPagesToShow: 10,
            pageSize: 10,
            totalResults: 0
        };
        vm.refresh = refresh;
        vm.search = search;
        vm.title = 'Questionnaires';

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.filteredQuestionnairesCount / vm.paging.pageSize) + 1;
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
            vm.filteredQuestionnairesCount = questionnaireService.getFilteredCount(vm.questionnairesFilter);
        }

        function getQuestionnairesCount() {
            return questionnaireService.getQuestionnairesCount()
                .then(function (data) {
                    return vm.questionnairesCount = data;
                });
        }

        function getQuestionnaires(forceRefresh) {
            toggleSpinner(true);
            return questionnaireService.getQuestionnaires(vm.activeServer.baseUrl, forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.questionnairesFilter)
                .then(function (data) {
                    vm.questionnaires = vm.filteredQuestionnaires = data;
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
                textContains(questionnaire.title, searchText)
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
                applyFilter(true);
            } else {
                applyFilter();
            }
        }

        function toggleSpinner(on) {
            vm.isBusy = on;
        }
    }
})();
