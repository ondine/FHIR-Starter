/**
 * Copyright 2014 Peter Bernhardt, et. al.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
(function () {
    'use strict';

    var serviceId = 'compositionService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'dataCache', 'fhirClient', compositionService]);

    function compositionService(common, dataCache, fhirClient) {
        var dataCacheKey = 'localCompositions';
        var linksCacheKey = 'linksCompositions';
        var isLoaded = false;
        var $q = common.$q;


        var service = {
            addComposition: addComposition,
            deleteComposition: deleteComposition,
            getCachedComposition: getCachedComposition,
            getFilteredCount: getFilteredCount,
            getRemoteComposition: getRemoteComposition,
            getCompositionsCount: getCompositionsCount,
            getCompositions: getCompositions,
            updateComposition: updateComposition
        };

        return service;

        function addComposition(baseUrl) {
            var deferred = $q.defer();
            var id = common.generateUUID();

            fhirClient.addResource(baseUrl + '/Composition/' + id)
                .then(function (results) {
                    deferred.resolve(results);
                },
                function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function deleteComposition(resourceId) {
            var deferred = $q.defer();
            fhirClient.deleteResource(resourceId)
                .then(function (results) {
                    deferred.resolve(results);
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

        function getRemoteComposition(resourceId) {
            var deferred = $q.defer();
            fhirClient.getResource(resourceId)
                .then(function (results) {
                    deferred.resolve(results);
                },
                function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function getCachedComposition(hashKey) {
            var deferred = $q.defer();
            _getAllLocal()
                .then(getComposition,
                function () {
                    deferred.reject('Composition search results not found in cache.');
                });
            return deferred.promise;

            function getComposition(cachedEntries) {
                var cachedComposition;
                for (var i = 0, len = cachedEntries.length; i < len; i++) {
                    if (cachedEntries[i].$$hashKey === hashKey) {
                        cachedComposition = cachedEntries[i];
                        break;
                    }
                }
                if (cachedComposition) {
                    deferred.resolve(cachedComposition)
                } else {
                    deferred.reject('Composition not found in cache: ' + hashKey);
                }
            }
        }

        function getCompositionsCount() {
            var deferred = $q.defer();
            if (_areCompositionsLoaded()) {
                _getAllLocal().then(function (data) {
                    deferred.resolve(data.length);
                });
            } else {
                return deferred.resolve(0);
            }
            return deferred.promise;
        }

        function getCompositions(forceRemote, baseUrl, page, size, filter) {
            var deferred = $q.defer();
            var take = size || 20;
            var skip = page ? (page - 1) * take : 0;

            if (_areCompositionsLoaded() && !forceRemote) {
                _getAllLocal().then(getByPage);
            } else {
                fhirClient.getResource(baseUrl + '/Composition?_count=100')
                    .then(querySucceeded,
                    function (outcome) {
                        deferred.reject(outcome);
                    }).then(getByPage);
            }

            function getByPage(entries) {
                var pagedCompositions;
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
                    pagedCompositions = filteredEntries;
                } else {
                    var start = (skip < filteredEntries.length) ? skip : (filteredEntries - size);
                    var items = ((start + size) >= filteredEntries.length) ? (filteredEntries.length) : (start + size);
                    pagedCompositions = filteredEntries.slice(start, items);
                }
                deferred.resolve(pagedCompositions);
            }

            function querySucceeded(results) {
                _areCompositionsLoaded(true);
                dataCache.addToCache(dataCacheKey, results.data);
                return results.data.entry;
            }

            return deferred.promise;
        }

        function updateComposition(resourceId, resource) {
            var deferred = $q.defer();

            fhirClient.addResource(resourceId, resource)
                .then(function (results) {
                    deferred.resolve(results);
                },
                function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function _getAllLocal() {
            var cachedCompositions = dataCache.readFromCache(dataCacheKey);
            return $q.when(cachedCompositions.entry);
        }

        function _areCompositionsLoaded(value) {
            if (value === undefined) {
                return isLoaded;
            }
            return isLoaded = true;
        }
    }
})();