'use strict';

FHIRStarter.factory('fhirClient',
    ['$http', '$q',
        function ($http, $q) {
            var getConformance = function (url) {
                var deferred = $q.defer();

                $http({method: 'GET', url: url})
                    .success(function (data, status, headers) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers) {
                        deferred.reject(data);
                    });

                return deferred.promise;
            };

            var search = function (url) {
                var deferred = $q.defer();

                $http({method: 'GET', url: url})
                    .success(function (data, status, headers) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers) {
                        var error = { "status": status, "outcome": data };
                        deferred.reject(error);
                    });

                return deferred.promise;
            };

            var getResource = function (url) {
                var deferred = $q.defer();

                $http.get(url)
                    .success(function (data, status, headers) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers) {
                        var error = { "status": status, "outcome": data };
                        deferred.reject(error);
                    });

                return deferred.promise;
            };

            var addResource = function (url, resource) {
                var deferred = $q.defer();

                $http.put(url, resource)
                    .success(function (data, status, headers) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers) {
                        var error = { "status": status, "outcome": data };
                        deferred.reject(error);
                    });
                return deferred.promise;
            };

            var updateResource = function (url, resource) {
                var deferred = $q.defer();

                $http.post(url, resource)
                    .success(function (data, status, headers) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers) {
                        var error = { "status": status, "outcome": data };
                        deferred.reject(error);
                    });
                return deferred.promise;
            };

            var deleteResource = function (url) {
                var deferred = $q.defer();

                $http.delete(url)
                    .success(function (data, status, url) {
                        deferred.resolve(data, status, url);
                    })
                    .error(function (data, status, headers) {
                        var error = { "status": status, "outcome": data };
                        deferred.reject(error);
                    });
                return deferred.promise;
            };

            return {
                getConformance: getConformance,
                search: search,
                delete: deleteResource,
                get: getResource,
                add: addResource,
                update: updateResource
            };
        }]);