(function () {
    'use strict';

    var controllerId = 'patientDetail';

    angular.module('FHIRStarter').controller(controllerId,
        ['$routeParams', 'common', patientDetail]);

    function patientDetail($routeParams, common) {
        var vm = this;

        vm.activate = activate;
        vm.patientIdParameter = $routeParams.hashKey;
        vm.title = 'patientDetail';

        activate();

        function activate() {
            common.activateController([], controllerId);
        }
    }
})();