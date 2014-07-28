(function () {
    'use strict';

    var controllerId = 'organization';

    // TODO: replace app with your module name
    angular.module('app').controller(controllerId,
        ['common', organization]);

    function organization(common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Organization';

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () { log('Activated Organization View'); });
        }
    }
})();
