(function () {
    'use strict';

    var controllerId = 'personDetail';

    angular.module('FHIRStarter').controller(controllerId,
        ['$routeParams', 'common', personDetail]);

    function personDetail($routeParams, common) {
        var vm = this;

        vm.activate = activate;
        vm.personIdParameter = $routeParams.hashKey;
        vm.title = 'personDetail';

        activate();

        function activate() {
            common.activateController([], controllerId);
        }
    }
})();