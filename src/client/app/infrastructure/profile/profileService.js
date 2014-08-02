(function () {
    'use strict';

    var serviceId = 'profileService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'dataCache', 'fhirClient', profileService]);

    function profileService(common, dataCache, fhirClient) {
        var getLogFn = common.logger.getLogFn;
        var dataCacheKey = 'localValuesets';
        var linksCacheKey = 'linksValuesets';
        var isLoaded = false;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var $q = common.$q;


        var service = {
            addValueset: addValueset,
            deleteValueset: deleteValueset,
            getCachedValueset: getCachedValueset,
            getFilteredCount: getFilteredCount,
            getRemoteValueset: getRemoteValueset,
            getValuesetsCount: getValuesetsCount,
            getValuesets: getValuesets,
            updateValueset: updateValueset
        };

        return service;

        function addValueset(baseUrl) {
            var deferred = $q.defer();
            var id = common.generateUUID();

            fhirClient.addResource(baseUrl + '/Valueset/' + id)
                .then(function (data) {
                    deferred.resolve(data);
                },
                function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function deleteValueset(resourceId) {
            var deferred = $q.defer();
            fhirClient.deleteResource(resourceId)
                .then(function (data) {
                    deferred.resolve(data);
                },
                function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function getFilteredCount(filter) {
            var deferred = $q.defer();
            var filterCount = 0;
            _getAllLocal().then(function (data) {
                for (var i = 0, len = data.length; i < len; i++) {
                    if (filter(data[i])) {
                        filterCount = (filterCount + 1);
                    }
                }
                deferred.resolve(filterCount);
            });
            return deferred.promise;
        }

        function getRemoteValueset(resourceId) {
            var deferred = $q.defer();
            fhirClient.getResource(resourceId)
                .then(function (data) {
                    deferred.resolve(data);
                },
                function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function getCachedValueset(hashKey) {
            var deferred = $q.defer();
            _getAllLocal()
                .then(getValueset,
                function () {
                    deferred.reject('Valueset search results not found in cache.');
                });
            return deferred.promise;

            function getValueset(cachedEntries) {
                var cachedValueset;
                for (var i = 0, len = cachedEntries.length; i < len; i++) {
                    if (cachedEntries[i].$$hashKey === hashKey) {
                        cachedValueset = cachedEntries[i];
                        break;
                    }
                }
                if (cachedValueset) {
                    deferred.resolve(cachedValueset)
                } else {
                    deferred.reject('Valueset not found in cache: ' + hashKey);
                }
            }
        }

        function getValuesetsCount() {
            var deferred = $q.defer();
            if (_areValuesetsLoaded()) {
                _getAllLocal().then(function (data) {
                    deferred.resolve(data.length);
                });
            } else {
                return deferred.resolve(0);
            }
            return deferred.promise;
        }

        function getValuesets(forceRemote, baseUrl, page, size, filter) {
            var deferred = $q.defer();
            var take = size || 20;
            var skip = page ? (page - 1) * take : 0;

            if (_areValuesetsLoaded() && !forceRemote) {
                _getAllLocal().then(getByPage);
            } else {
                fhirClient.getResource(baseUrl + '/Profile/_search?_count=500')
                    .then(querySucceeded,
                    function (outcome) {
                        deferred.reject(outcome);
                    }).then(getByPage);
            }

            function getByPage(entries) {
                var pagedValuesets;
                var filteredEntries = [];

                if (filter) {
                    for (var i = 0, len = entries.length; i < len; i++) {
                        if (filter(entries[i])) {
                            filteredEntries.push(entries[i]);
                        }
                    }
                } else {
                    filteredEntries = entries;
                }

                if (filteredEntries.length < size) {
                    pagedValuesets = filteredEntries;
                } else {
                    var start = (skip < filteredEntries.length) ? skip : (filteredEntries - size);
                    var items = ((start + size) >= filteredEntries.length) ? (filteredEntries.length) : (start + size);
                    pagedValuesets = filteredEntries.slice(start, items);
                }
                deferred.resolve(pagedValuesets);
            }

            function querySucceeded(data) {
                _areValuesetsLoaded(true);
                log('Retrieved ' + data.entry.length + ' of ' + data.totalResults + ' available [Valuesets] from remote FHIR server', data.entry.length)
                dataCache.addToCache(dataCacheKey, data.entry);
                return data.entry;
            }

            return deferred.promise;
        }

        function updateValueset(resourceId, resource) {
            var deferred = $q.defer();

            fhirClient.addResource(resourceId, resource)
                .then(function (data) {
                    deferred.resolve(data);
                },
                function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function _getAllLocal() {
            var cachedValuesets = dataCache.readFromCache(dataCacheKey);
            return $q.when(cachedValuesets);
        }

        function _areValuesetsLoaded(value) {
            if (value === undefined) {
                return isLoaded;
            }
            return isLoaded = true;
        }
    }
})();