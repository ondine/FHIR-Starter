(function () {
    'use strict';

    var controllerId = 'patientDetail';

    angular.module('FHIRStarter').controller(controllerId,
        ['$routeParams', '$window', 'common', 'patientService', patientDetail]);

    function patientDetail($routeParams, $window, common, patientService) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');

        vm.cancel = cancel;
        vm.activate = activate;
        vm.getTitle = getTitle;
        vm.goBack = goBack;
        vm.isSaving = false;
        vm.isEditing = true;
        vm.patient = undefined;
        vm.patientIdParameter = $routeParams.hashKey;
        vm.save = save;
        vm.title = 'patientDetail';

        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });

        Object.defineProperty(vm, 'canDelete', {
            get: canDelete
        });

        activate();

        function activate() {
            common.activateController([getRequestedPatient()], controllerId);
        }

        function cancel() {

        }

        function canDelete() {
            return !vm.isEditing;
        }

        function canSave() {
            return !vm.isSaving;
        }

        function getRequestedPatient() {
            var val = $routeParams.hashKey;
            if (val !== 'new') {
                return patientService.getCachedPatient(val)
                .then(function(data) {
                    vm.patient = data;
                }, function(error) {
                    logError(error);
                });
            }
        }

        function getTitle() {
            return 'Edit ' + ((vm.patient && vm.patient.fullName) || '');
        }

        function goBack() {
            $window.history.back();
        }

        function save() {

        }
    }
})();