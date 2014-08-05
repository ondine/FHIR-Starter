(function () {
    'use strict';

    var controllerId = 'address';

    angular.module('FHIRStarter').controller(controllerId, ['$scope', 'common', 'addressService', 'localValueSets', address]);

    function address($scope, common, addressService, localValueSets) {
        var vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');

        vm.addToList = addToList;
        vm.editListItem = editListItem;
        vm.address = {};
        vm.addresses = [];
        vm.removeListItem = removeListItem;
        vm.reset = reset;

        activate();

        function activate() {
            common.activateController([getAddresses(), getStates()], controllerId).then(function () {
                // nothing yet
            });
        }

        function addToList(form, item) {
            if (form.$valid) {
                addressService.add(item);
                vm.addresses = addressService.getAll();
                vm.address = {};
                form.$setPristine();
            }
        }

        function editListItem(item) {
            vm.address = item;
        }

        function getAddresses() {
            vm.addresses = addressService.getAll();
        }

        function getCountries() {
            
        }
        
        function getStates() {
            vm.states = localValueSets.usaStates();
        }

        function removeListItem(item) {
            addressService.remove(item);
            vm.addresses = addressService.getAll();
        }

        function reset(form) {
            vm.address = {};
            form.$setPristine();
        }
    }
})();
