'use strict';

FHIRStarter.controller('IdentifierController',
    ['$scope', 'identifierService',
        function ($scope, identifierService) {

            $scope.$on('initIdentifier',
                function (event, data) {
                    identifierService.init(data);
                    $scope.identifiers = identifierService.getAll();
                });

            $scope.$on('resetAll',
                function () {
                    identifierService.reset();
                    $scope.identifiers = identifierService.getAll();
                });

            $scope.reset = function (form) {
                $scope.identifier = null;
                form.$setPristine();
            };

            $scope.saveIdentifier = function (form, item) {
                if (form.$valid) {
                    identifierService.add(item);
                    $scope.$emit('updatedIdentifiers', identifierService.getAll());
                    $scope.identifiers = identifierService.getAll();
                    $scope.identifier = null;
                    form.$setPristine();
                }
            };

            $scope.editIdentifier = function (item) {
                $scope.identifier = item;
            };

            $scope.removeIdentifier = function (item) {
                identifierService.remove(item);
                $scope.$emit('updatedIdentifiers', identifierService.getAll());
                $scope.identifiers = identifierService.getAll();
            };
        }]);
