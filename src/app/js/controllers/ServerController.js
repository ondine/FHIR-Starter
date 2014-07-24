'use strict';

FHIRStarter.controller('ServerController',
    ['$scope', '$routeParams', '$log', '$location', 'serverService', 'conformanceService',
        function ($scope, $routeParams, $log, $location, serverService, conformanceService) {

            $scope.activeServer = serverService.getActiveServer();
            $scope.conformance = conformanceService.getFromCache();

            var getConformance = function () {

                conformanceService.get($scope.activeServer.baseUrl).then(onFetched, onError);
            };

            var onFetched = function (data) {
                $scope.conformance = data;
                serverService.setActiveServer($scope.activeServer);
            };

            var onError = function (reason) {
                $scope.activeServer = serverService.getActiveServer();
                $scope.error = reason;
            };

            $scope.addNewServer = function () {
                if (serverService.getActiveServer().baseUrl !== $scope.activeServer.baseUrl) {
                    conformanceService.reset();
                    serverService.addNewServer($scope.activeServer);
                    getConformance();
                } else {
                    var conformance = conformanceService.getFromCache();
                    if (angular.isUndefined(conformance) || conformance === null) {
                        getConformance();
                    } else {
                        $scope.conformance = conformance;
                    }
                }
            };
        }
    ])
;