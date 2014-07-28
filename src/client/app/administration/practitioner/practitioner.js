(function () {
    'use strict';

    var controllerId = 'practitioner';

    // TODO: replace app with your module name
    angular.module('app').controller(controllerId,
        ['common', practitioner]);

    function practitioner(common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Practitioner';

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () { log('Activated Practitioner View'); });
        }
    }
})();
