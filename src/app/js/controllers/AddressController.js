'use strict';

FHIRStarter.controller('AddressController',
    ['$scope', 'addressService',
        function ($scope, addressService) {

            $scope.states = addressService.getStatesOfUSA();

            $scope.$on('initAddress',
                function (event, data) {
                    addressService.init(data);
                    $scope.addresses = addressService.getAll();
                });

            $scope.$on('resetAll',
                function () {
                    addressService.reset();
                    $scope.addresses = addressService.getAll();
                });

            $scope.reset = function (form) {
                $scope.address = null;
                $scope.addresses = addressService.getAll();
                form.$setPristine();
            };

            $scope.saveAddress = function (form, item) {
                if (form.$valid) {
                    addressService.add(item);
                    $scope.$emit('updatedAddresses', addressService.getAll());
                    $scope.addresses = addressService.getAll();
                    $scope.address = null;
                    form.$setPristine();
                }
            };

            $scope.editAddress = function (item) {
                $scope.address = item;
            };

            $scope.removeAddress = function (item) {
                addressService.remove(item);
                $scope.$emit('updatedAddresses', addressService.getAll());
                $scope.addresses = addressService.getAll();
            };
        }]);
