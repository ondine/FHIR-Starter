(function () {
    'use strict';

    var controllerId = 'practitionerDetail';

    angular.module('FHIRStarter').controller(controllerId,
        ['$routeParams', 'common', practitionerDetail]);

    function practitionerDetail($routeParams, common) {
        var vm = this;

        vm.activate = activate;
        vm.practitionerIdParameter = $routeParams.hashKey;
        vm.title = 'practitionerDetail';

        activate();

        function activate() {
            common.activateController([], controllerId);
        }
    }
})();