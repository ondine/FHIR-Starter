(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('FHIRStarter').controller(controllerId, ['common', dashboard]);

    function dashboard(common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.news = {
            title: 'FHIR Starter',
            description: 'FHIR Starter is a SPA template for FHIR implementers using AngularJS.'
        };
        vm.messageCount = 0;
        vm.people = [];
        vm.title = 'Dashboard';

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId);
        }
    }
})();