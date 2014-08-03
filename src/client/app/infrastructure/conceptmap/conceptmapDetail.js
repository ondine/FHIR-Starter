(function () {
    'use strict';

    var controllerId = 'conceptmapDetail';

    angular.module('FHIRStarter').controller(controllerId,
        ['$routeParams', '$window', 'common', 'conceptmapService', conceptmapDetail]);

    function conceptmapDetail($routeParams, $window, common, conceptmapService) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');

        vm.cancel = cancel;
        vm.activate = activate;
        vm.getTitle = getTitle;
        vm.goBack = goBack;
        vm.isSaving = false;
        vm.isEditing = true;
        vm.conceptmap = undefined;
        vm.conceptmapIdParameter = $routeParams.hashKey;
        vm.save = save;
        vm.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };
        vm.title = 'conceptmapDetail';

        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });

        Object.defineProperty(vm, 'canDelete', {
            get: canDelete
        });

        activate();

        function activate() {
            common.activateController([getRequestedConceptmap()], controllerId);
        }

        function cancel() {

        }

        function canDelete() {
            return !vm.isEditing;
        }

        function canSave() {
            return !vm.isSaving;
        }

        function getRequestedConceptmap() {
            var val = $routeParams.hashKey;
            if (val !== 'new') {
                return conceptmapService.getCachedConceptmap(val)
                .then(function(data) {
                    vm.conceptmap = data;
                }, function(error) {
                    logError(error);
                });
            }
        }

        function getTitle() {
            return 'Edit ' + ((vm.conceptmap && vm.conceptmap.fullName) || '');
        }

        function goBack() {
            $window.history.back();
        }

        function save() {

        }
    }
})();