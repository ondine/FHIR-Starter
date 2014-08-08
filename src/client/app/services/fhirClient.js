(function () {
    'use strict';

    var serviceId = 'fhirClient';

    angular.module('FHIRStarter').factory(serviceId, ['$http', 'common', fhirClient]);

    function fhirClient($http, common) {
        var $q = common.$q;

        var service = {
            deleteResource: deleteResource,
            getResource: getResource,
            addResource: addResource,
            updateResource: updateResource
        };

        return service;

        function addResource(baseUrl, resource) {
            var deferred = $q.defer();
            $http.post(baseUrl, common.removeNullProperties(resource))
                .success(function (data, status, headers, config) {
                    var results = [];
                    results.data = data;
                    results.headers = headers();
                    results.status = status;
                    results.config = config;
                    deferred.resolve(results);
                })
                .error(function (data, status) {
                    var error = { "status": status, "outcome": data };
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function deleteResource(resourceUrl) {
            var deferred = $q.defer();

            $http.delete(resourceUrl)
                .success(function (data, status, url) {
                    deferred.resolve(data, status, url);
                })
                .error(function (data, status, headers) {
                    var error = { "status": status, "outcome": data };
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function getResource(resourceUrl) {
            var deferred = $q.defer();

            $http.get(resourceUrl)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data, status) {
                    var error = { "status": status, "outcome": data };
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function updateResource(resourceUrl, resource) {
            var deferred = $q.defer();

            $http.put(resourceUrl, common.removeNullProperties(resource))
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data, status) {
                    var error = { "status": status, "outcome": data };
                    deferred.reject(error);
                });
            return deferred.promise;
        }
    }
})();