(function () {
    'use strict';

    var controllerId = 'patient';

    // TODO: replace app with your module name
    angular.module('app').controller(controllerId,
        ['common', patient]);

    function patient(common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Patient';

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () { log('Activated Patient View'); });
        }
    }
})();
