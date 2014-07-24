'use strict';

FHIRStarter.controller('MainController',
    ['$scope', '$anchorScroll', '$route', '$location', 'serverService', 'conformanceService',
        function ($scope, $anchorScroll, $route, $location, serverService, conformanceService) {
            $scope.activeServer = serverService.getActiveServer();
            $scope.servers = serverService.getAllServers();

            $scope.changeServer = function (id) {
                var serverId;
                if (isNaN(id)) {
                    return;
                } else {
                    serverId = parseInt(id);
                }
                $scope.activeServer = serverService.getServerById(serverId);
                serverService.setActiveServer($scope.activeServer);
                conformanceService.reset();
                $location.hash('top');
                $anchorScroll();

            };
        }]);
