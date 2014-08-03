(function () {
    'use strict';

    var serviceId = 'conceptmapService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'dataCache', 'fhirClient', conceptmapService]);

    function conceptmapService(common, dataCache, fhirClient) {
        var getLogFn = common.logger.getLogFn;
        var dataCacheKey = 'localConceptmaps';
        var linksCacheKey = 'linksConceptmaps';
        var isLoaded = false;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var $q = common.$q;


        var service = {
            addConceptmap: addConceptmap,
            deleteConceptmap: deleteConceptmap,
            getCachedConceptmap: getCachedConceptmap,
            getFilteredCount: getFilteredCount,
            getRemoteConceptmap: getRemoteConceptmap,
            getConceptmapsCount: getConceptmapsCount,
            getConceptmaps: getConceptmaps,
            updateConceptmap: updateConceptmap
        };

        return service;

        function addConceptmap(baseUrl) {
            var deferred = $q.defer();
            var id = common.generateUUID();

            fhirClient.addResource(baseUrl + '/Conceptmap/' + id)
                .then(function (data) {
                    deferred.resolve(data);
                },
                function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function deleteConceptmap(resourceId) {
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

        function getRemoteConceptmap(resourceId) {
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

        function getCachedConceptmap(hashKey) {
            var deferred = $q.defer();
            _getAllLocal()
                .then(getConceptmap,
                function () {
                    deferred.reject('Conceptmap search results not found in cache.');
                });
            return deferred.promise;

            function getConceptmap(cachedEntries) {
                var cachedConceptmap;
                for (var i = 0, len = cachedEntries.length; i < len; i++) {
                    if (cachedEntries[i].$$hashKey === hashKey) {
                        cachedConceptmap = cachedEntries[i];
                        break;
                    }
                }
                if (cachedConceptmap) {
                    deferred.resolve(cachedConceptmap)
                } else {
                    deferred.reject('Conceptmap not found in cache: ' + hashKey);
                }
            }
        }

        function getConceptmapsCount() {
            var deferred = $q.defer();
            if (_areConceptmapsLoaded()) {
                _getAllLocal().then(function (data) {
                    deferred.resolve(data.length);
                });
            } else {
                return deferred.resolve(0);
            }
            return deferred.promise;
        }

        function getConceptmaps(forceRemote, baseUrl, page, size, filter) {
            var deferred = $q.defer();
            var take = size || 20;
            var skip = page ? (page - 1) * take : 0;

            if (_areConceptmapsLoaded() && !forceRemote) {
                _getAllLocal().then(getByPage);
            } else {
                fhirClient.getResource(baseUrl + '/ConceptMap/_search?_count=500')
                    .then(querySucceeded,
                    function (outcome) {
                        deferred.reject(outcome);
                    }).then(getByPage);
            }

            function getByPage(entries) {
                var pagedConceptmaps;
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
                    pagedConceptmaps = filteredEntries;
                } else {
                    var start = (skip < filteredEntries.length) ? skip : (filteredEntries - size);
                    var items = ((start + size) >= filteredEntries.length) ? (filteredEntries.length) : (start + size);
                    pagedConceptmaps = filteredEntries.slice(start, items);
                }
                deferred.resolve(pagedConceptmaps);
            }

            function querySucceeded(data) {
                _areConceptmapsLoaded(true);
                log('Retrieved ' + data.entry.length + ' of ' + data.totalResults + ' available [Conceptmaps] from remote FHIR server', data.entry.length)
                dataCache.addToCache(dataCacheKey, data.entry);
                return data.entry;
            }

            return deferred.promise;
        }

        function updateConceptmap(resourceId, resource) {
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
            var cachedConceptmaps = dataCache.readFromCache(dataCacheKey);
            return $q.when(cachedConceptmaps);
        }

        function _areConceptmapsLoaded(value) {
            if (value === undefined) {
                return isLoaded;
            }
            return isLoaded = true;
        }
    }
})();