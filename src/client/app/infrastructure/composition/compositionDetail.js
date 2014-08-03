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