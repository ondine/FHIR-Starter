(function () {
    'use strict';

    var controllerId = 'address';

    angular.module('FHIRStarter').controller(controllerId, ['common', 'config', 'addressService', address]);

    function address(common, config, addressService) {
        var vm = this;
        var keyCodes = config.keyCodes;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var $q = common.$q;

        vm.address = {};
        vm.addresses = [];
        vm.addToList = addToList;
        vm.capture = capture;
        vm.editListItem = editListItem;
        vm.getLocation = getLocation;
        vm.loadingLocations = false;
        vm.removeListItem = removeListItem;
        vm.reset = reset;
        vm.showHome = true;

        activate();

        function activate() {
            common.activateController([getAddresses(), supportHome(), initAddress() ], controllerId).then(function () {
                // nothing else
            });
        }

        function addToList(form, item) {
            if (form.$valid) {
                addressService.add(item);
                vm.addresses = addressService.getAll();
                initAddress();
                form.$setPristine();
            }
        }

        function capture($event, form, item) {
            if (form.$valid) {
                if ($event.keyCode === keyCodes.esc) {
                    initAddress();
                } else if ($event.keyCode === keyCodes.enter) {
                    addToList(form, item);
                }
            }
        }

        function editListItem(item) {
            vm.address = item;
        }

        function getAddresses() {
            vm.addresses = addressService.getAll();
        }

        function getLocation(input) {
            var deferred = $q.defer();
            vm.loadingLocations = true;
            addressService.searchGoogle(input)
                .then(function (data) {
                    vm.loadingLocations = false;
                    deferred.resolve(data);
                }, function (error) {
                    vm.loadingLocations = false;
                    logError(error);
                    deferred.reject();
                });
            return deferred.promise;
        }

        function initAddress() {
            return vm.address = { "use": "work"};
        }

        function removeListItem(item) {
            addressService.remove(item);
            vm.addresses = addressService.getAll();
        }

        function reset(form) {
            initAddress();
            form.$setPristine();
        }

        function supportHome() {
            return vm.showHome = addressService.supportHome();
        }
    }
})();
