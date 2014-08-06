(function () {
    'use strict';

    var controllerId = 'telecom';

    angular.module('FHIRStarter').controller(controllerId, ['common', 'telecomService', telecom]);

    function telecom(common, telecomService) {
        var vm = this;

        vm.addToList = addToList;
        vm.editListItem = editListItem;
        vm.telecom = { purpose: { coding: []}};
        vm.telecoms = [];
        vm.removeListItem = removeListItem;
        vm.reset = reset;
        vm.showHome = true;
        vm.showMobile = true;

        activate();

        function activate() {
            common.activateController([getTelecoms(), supportHome(), supportMobile()], controllerId).then(function () {
                vm.telecom = { "use": "work"};
            });
        }

        function addToList(form, item) {
            if (form.$valid) {
                telecomService.add(item);
                vm.telecoms = telecomService.getAll();
                vm.telecom = {};
                form.$setPristine();
            }
        }

        function editListItem(item) {
            vm.telecom = item;
        }

        function getTelecoms() {
            vm.telecoms = telecomService.getAll();
        }

        function removeListItem(item) {
            telecomService.remove(item);
            vm.telecoms = telecomService.getAll();
        }

        function reset(form) {
            form.$setPristine();
            vm.telecom = { "use": "work"};
        }

        function supportHome() {
            return vm.showHome = telecomService.supportHome();
        }

        function supportMobile() {
            return vm.showMobile = telecomService.supportMobile();
        }
    }
})();
