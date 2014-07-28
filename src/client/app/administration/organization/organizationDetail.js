(function () {
    'use strict';

    var controllerId = 'organizationDetail';

    angular.module('FHIRStarter').controller(controllerId,
        ['$routeParams', 'common', organizationDetail]);

    function organizationDetail($routeParams, common) {
        var vm = this;

        vm.activate = activate;
        vm.organizationIdParameter = $routeParams.hashKey;
        vm.title = 'organizationDetail';

        activate();

        function activate() {
            common.activateController([], controllerId);
        }
    }
})();