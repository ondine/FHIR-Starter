'use strict';

FHIRStarter.controller('TelecomController',
    ['$scope', 'telecomService',
        function ($scope, telecomService) {

            $scope.$on('initTelecom',
                function (event, data) {
                    telecomService.init(data);
                    $scope.telecoms = telecomService.getAll();
                });

            $scope.$on('resetAll',
                function () {
                    telecomService.reset();
                    $scope.telcoms = telecomService.getAll();
                });

            $scope.reset = function (form) {
                $scope.telecom = null;
                form.$setPristine();
            };

            $scope.saveTelecom = function (form, item) {
                if (form.$valid) {
                    telecomService.add(item);
                    $scope.$emit('updatedTelecoms', telecomService.getAll());
                    $scope.telecoms = telecomService.getAll();
                    $scope.telecom = null;
                    form.$setPristine();
                }
            };

            $scope.editTelecom = function (item) {
                $scope.telecom = item;
            };

            $scope.removeTelecom = function (item) {
                telecomService.remove(item);
                $scope.$emit('updatedTelecoms', telecomService.getAll());
                $scope.telecoms = telecomService.getAll();
            }
        }]);
