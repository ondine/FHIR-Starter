(function () {
    'use strict';

    var controllerId = 'identifier';

    angular.module('FHIRStarter').controller(controllerId, ['$scope', 'common', 'identifierService', identifier]);

    function identifier($scope, common, identifierService) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');

        vm.addToList = addToList;
        vm.editListItem = editListItem;
        vm.identifier = {};
        vm.identifiers = [];
        vm.removeListItem = removeListItem;
        vm.reset = reset;
        vm.genId = generateIdentifier;

        activate();

        function activate() {
            common.activateController([getIdentifiers()], controllerId).then(function () {
                vm.identifier = { "use": "usual"};
            });
        }

        function addToList(form, item) {
            if (form.$valid) {
                identifierService.add(item);
                vm.identifiers = identifierService.getAll();
                vm.identifier = {};
                form.$setPristine();
            }
        }

        function editListItem(item) {
            vm.identifier = item;
        }

        function generateIdentifier() {
            return common.generateUUID();
        }

        function getIdentifiers() {
            vm.identifiers = identifierService.getAll();
        }

        function removeListItem(item) {
            identifierService.remove(item);
            vm.identifiers = identifierService.getAll();
        }

        function reset(form) {
            vm.identifier = { "use": "usual"};
            form.$setPristine();
        }
    }
})();
