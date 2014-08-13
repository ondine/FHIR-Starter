(function () {
    'use strict';

    var controllerId = 'profileQuestionnaire';

    angular.module('FHIRStarter').controller(controllerId,
        ['$routeParams', '$window', 'common', 'profileService', 'questionnaireService', profileQuestionnaire]);

    function profileQuestionnaire($routeParams, $window, common, profileService, questionnaireService) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');

        vm.cancel = cancel;
        vm.activate = activate;
        vm.getTitle = getTitle;
        vm.goBack = goBack;
        vm.isSaving = false;
        vm.isEditing = true;
        vm.questionnaire = undefined;
        vm.questionnaireIdParameter = $routeParams.hashKey;
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
                    logError(error);
                });
        }

        function getTitle() {
            return 'Edit ' + ((vm.questionnaire && vm.questionnaire.fullName) || '');
        }

        function goBack() {
            $window.history.back();
        }

        function save() {

        }
    }
})();