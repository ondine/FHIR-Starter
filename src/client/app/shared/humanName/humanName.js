(function () {
    'use strict';

    var controllerId = 'humanName';

    angular.module('FHIRStarter').controller(controllerId, ['$scope', 'common', 'humanNameService', humanName]);

    function humanName($scope, common, humanNameService) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');

        vm.addToList = addToList;
        vm.editListItem = editListItem;
        vm.humanName = {};
        vm.humanNames = [];
        vm.removeListItem = removeListItem;
        vm.reset = reset;

        activate();

        function activate() {
            common.activateController([getHumanNames()], controllerId).then(function () {
                vm.humanName = { "use": "usual"};
            });
        }

        function addToList(form, item) {
            if (form.$valid) {
                humanNameService.add(item);
                vm.humanNames = humanNameService.getAll();
                vm.humanName = {};
                form.$setPristine();
            }
        }

        function editListItem(item) {
            vm.humanName = item;
        }

        function getHumanNames() {
            vm.humanNames = humanNameService.getAll();
        }

        function removeListItem(item) {
            humanNameService.remove(item);
            vm.humanNames = humanNameService.getAll();
        }

        function reset(form) {
            vm.humanName = { "use": "usual"};
            form.$setPristine();
        }
    }
})();
