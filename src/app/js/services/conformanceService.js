'use strict';

FHIRStarter.factory('conformanceService',
    ['$http', '$q', 'cacheData',
        function ($http, $q, cacheData) {
            var getConformance = function (baseUrl) {
                var deferred = $q.defer();
                $http.get(baseUrl + '/metadata')
                    .success(function (data) {
                        cacheData.addToCache('conformance', data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status) {
                        var error = { "status": status, "outcome": data };
                        deferred.reject(error);
                    });
                return deferred.promise;
            };

            var getFromCache = function () {
                return cacheData.readFromCache('conformance');
            };

            var reset = function() {
                cacheData.addToCache('conformance', null);
            };

            return {
                get: getConformance,
                getFromCache: getFromCache,
                reset: reset
            };
        }]);