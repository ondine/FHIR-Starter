(function () {
    'use strict';

    var serviceId = 'patientService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'dataCache', 'fhirClient', patientService]);

    function patientService(common, dataCache, fhirClient) {
        var dataCacheKey = 'localPatients';
        var linksCacheKey = 'linksPatients';
        var itemCacheKey = 'contextPatient';
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var $q = common.$q;

        var service = {
            addPatient: addPatient,
            deleteCachedPatient: deleteCachedPatient,
            deletePatient: deletePatient,
            getCachedPatient: getCachedPatient,
            getCachedSearchResults: getCachedSearchResults,
            getPatient: getPatient,
            getPatients: getPatients,
            updatePatient: updatePatient
        };

        return service;

        function addPatient(resource) {

        }

        function deleteCachedPatient(hashKey, resourceId) {
            var deferred = $q.defer();
            deletePatient(resourceId)
                .then(getCachedSearchResults,
                function (error) {
                    deferred.reject(error);
                })
                .then(removeFromCache)
                .then(function () {
                    deferred.resolve()
                });

            return deferred.promise;

            function removeFromCache(searchResults) {
                var removed = false;
                var cachedPatients = searchResults.entry;
                for (var i = 0, len = cachedPatients.length; i < len; i++) {
                    if (cachedPatients[i].$$hashKey === hashKey) {
                        cachedPatients.splice(i, 1);
                        searchResults.entry = cachedPatients;
                        searchResults.totalResults = (searchResults.totalResults - 1);
                        dataCache.addToCache(dataCacheKey, searchResults);
                        removed = true;
                        break;
                    }
                }
                if (removed) {
                    deferred.resolve();
                } else {
                    logError('Patient not found in cache: ' + hashKey);
                    deferred.resolve();
                }
            }
        }

        function deletePatient(resourceId) {
            var deferred = $q.defer();
            fhirClient.deleteResource(resourceId)
                .then(function (data) {
                    logSuccess(resourceId + ' deleted' + data);
                    deferred.resolve();
                }, function (outcome) {
                    logError('Failed to delete' + resourceId + outcome);
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function getCachedPatient(hashKey) {
            var deferred = $q.defer();
            getCachedSearchResults()
                .then(getPatient,
                function () {
                    deferred.reject('Patient search results not found in cache.');
                });
            return deferred.promise;

            function getPatient(searchResults) {
                var cachedPatient;
                var cachedPatients = searchResults.entry;
                for (var i = 0, len = cachedPatients.length; i < len; i++) {
                    if (cachedPatients[i].$$hashKey === hashKey) {
                        cachedPatient = cachedPatients[i];
                        cachedPatient.content.resourceId = cachedPatient.id;
                        cachedPatient.content.hashKey = cachedPatient.$$hashKey;
                        break;
                    }
                }
                if (cachedPatient) {
                    deferred.resolve(cachedPatient.content)
                } else {
                    deferred.reject('Patient not found in cache: ' + hashKey);
                }
            }
        }

        function getCachedSearchResults() {
            var deferred = $q.defer();
            var cachedSearchResults = dataCache.readFromCache(dataCacheKey);
            if (cachedSearchResults) {
                deferred.resolve(cachedSearchResults);
            } else {
                deferred.reject('Search results not cached.');
            }
            return deferred.promise;
        }

        function getPatient(resourceId) {
            var deferred = $q.defer();
            fhirClient.getResource(resourceId)
                .then(function (data) {
                    dataCache.addToCache(dataCacheKey, data);
                    deferred.resolve(data);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function getPatients(baseUrl, nameFilter, page, size) {
            var deferred = $q.defer();
            var params = '';
            var take = size || 20;
            var skip = page ? (page - 1) * take : 0;

            if (angular.isUndefined(nameFilter)) {
                deferred.reject('Invalid search input');
            }
            var names = nameFilter.split(' ');
            if (names.length === 1) {
                params = 'name=' + names[0];
            } else {
                params = 'given=' + names[0] + '&family=' + names[1];
            }
            params = params + '&_offset=' + skip + '&_count=' + take;

            fhirClient.getResource(baseUrl + '/Patient/_search?' + params)
                .then(function (data) {
                    dataCache.addToCache(dataCacheKey, data);
                    deferred.resolve(data);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function updatePatient(resourceId, resource) {
        }
    }
})();