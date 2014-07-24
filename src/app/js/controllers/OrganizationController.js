'use strict';

FHIRStarter.controller('OrganizationController',
    ['$scope', '$routeParams', '$log', '$route', '$location', '$anchorScroll', 'organizationService',
        function ($scope, $routeParams, $log, $route, $location, $anchorScroll, organizationService) {
            $scope.coding = null;
            $scope.codings = organizationService.getTypeCoding();
            $scope.mode = $route.current.mode;
            $scope.searchText = "";

            $scope.$on('updatedIdentifiers',
                function (event, data) {
                    $scope.organization.identifier = data;
                });

            $scope.$on('updatedAddresses',
                function (event, data) {
                    $scope.organization.address = data;
                });

            $scope.$on('updatedTelecoms',
                function (event, data) {
                    $scope.organization.telecom = data;
                });

            $scope.reset = function () {
                $anchorScroll();
                $route.reload();
            };

            $scope.enterSubmit = function () {
                if (angular.isDefined($scope.searchText)) {
                    organizationService.query($scope.searchText).then(onSearch, onError);
                }
            };

            $scope.save = function () {
                if ($scope.organization.name.length < 5) {
                    $log.warn("Org name must be at least 5 characters");
                } else if ($scope.mode === 'add') {
                    organizationService.add($scope.organization)
                        .then(onSaved, onError);
                } else if ($scope.mode === 'edit') {
                    organizationService.update($scope.resource.id, $scope.organization)
                        .then(onSaved, onError);
                } else {
                    $log.warn("Incorrect mode for this operation: expected 'add' or 'edit'");
                }
            };

            var initializeOrganization = function () {
                if ($scope.mode === 'search') {
                    return;
                } else if ($scope.mode === 'edit') {
                    var itemToEdit = organizationService.getCachedSearchItem($routeParams.hash);
                    $scope.resource = itemToEdit;
                    organizationService.get($scope.resource.id)
                        .then(onFetched, onError);
                } else {
                    $scope.organization = organizationService.init();
                    $scope.$broadcast('resetAll');
                }

            };

            $scope.delete = function (hashKey) {
                var itemToDelete = organizationService.getCachedSearchItem(hashKey);
                $scope.resource = itemToDelete;
                organizationService.delete($scope.resource.id).then(onDeleted, onError);
            };

            $scope.edit = function (hashKey) {
                $location.url('/editOrganization/' + hashKey);
            };

            $scope.search = function () {
                organizationService.query($scope.searchText).then(onSearch, onError);
            };

            var onSearch = function (data) {
                $scope.bundle = data;
                $scope.searchedText = $scope.searchText;
            };

            var onDeleted = function () {
                $scope.message = $scope.resource.title + " deleted.";
                if (angular.isDefined($scope.searchText)) {
                    $scope.search($scope.searchText);
                }
                $anchorScroll();
            };

            var onSaved = function (data) {
                if ($scope.mode === 'edit') {
                    $scope.message = $scope.resource.title + " saved.";
                } else {
                    $scope.message = $scope.organization.name + " added.";
                    $scope.mode = 'edit';
                }
                ;
                initializeOrganization();
                $anchorScroll();
            };

            var onFetched = function (data) {
                $scope.organization = data;
                $scope.$broadcast('initIdentifier', $scope.organization.identifier);
                $scope.$broadcast('initAddress', $scope.organization.address);
                $scope.$broadcast('initTelecom', $scope.organization.telecom);
                $anchorScroll();
            };

            var onError = function (error) {
                $scope.error = error;
                $anchorScroll();
            };

            initializeOrganization();
        }
    ]);
