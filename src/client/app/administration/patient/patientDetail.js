(function () {
    'use strict';

    var controllerId = 'patientDetail';

    angular.module('FHIRStarter').controller(controllerId,
        ['$location', '$routeParams', '$window', 'common', 'fhirServers', 'patientService', patientDetail]);

    function patientDetail($location, $routeParams, $window, common, fhirServers, patientService) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');

        vm.activeServer;
        vm.calculateAge = calculateAge;
        vm.cancel = cancel;
        vm.activate = activate;
        vm.delete = deletePatient;
        vm.edit = edit;
        vm.getTitle = getTitle;
        vm.goBack = goBack;
        vm.isSaving = false;
        vm.isEditing = true;
        vm.patient = undefined;
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
            common.activateController([getActiveServer()], controllerId).then(function () {
                getRequestedPatient();
            });
        }

        function calculateAge(birthDate) {
            if (birthDate) {
                var ageDifMs = Date.now() - birthDate.getTime();
                var ageDate = new Date(ageDifMs); // miliseconds from epoch
                return Math.abs(ageDate.getUTCFullYear() - 1970);
            } else {
                return undefined;
            }
        }

        function cancel() {

        }

        function canDelete() {
            return !vm.isEditing;
        }

        function canSave() {
            return !vm.isSaving;
        }

        function deletePatient(patient) {
            if (patient && patient.resourceId && patient.hashKey) {
                patientService.deleteCachedPatient(patient.hashKey, patient.resourceId)
                    .then(function () {
                        $location.path('/patients');
                    },
                    function (error) {
                        logError(error);
                    }
                );
            }
        }

        function edit(patient) {
            if (patient && patient.hashKey) {
                $location.path('/patient/' + patient.hashKey);
            }
        }

        function getActiveServer() {
            fhirServers.getActiveServer()
                .then(function (server) {
                    return vm.activeServer = server;
                });
        }

        function getRequestedPatient() {
            if ($routeParams.hashKey && $routeParams.hashKey !== 'new') {
                return patientService.getCachedPatient($routeParams.hashKey)
                    .then(function (data) {
                        vm.patient = data;
                    }, function (error) {
                        logError(error);
                    });
            } else if ($routeParams.id) {
                var resourceId = vm.activeServer.baseUrl + '/Patient/' + $routeParams.id;
                return patientService.getPatient(resourceId)
                    .then(function (data) {
                        vm.patient = data;
                    }, function (error) {
                        logError(error);
                    });
            }
            else {
                vm.title = 'Add New Patient';
            }
        }

        function getTitle() {
            var title = '';
            if (vm.patient) {
                title = vm.title = 'Edit ' + ((vm.patient && vm.patient.fullName) || '');
            } else {
                title = vm.title = 'Add New Patient';
            }
            return vm.title = title;

        }

        function goBack() {
            $window.history.back();
        }

        function save() {

        }
    }
})();