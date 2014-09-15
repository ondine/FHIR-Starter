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

    var serviceId = 'allergyIntoleranceService';

    angular.module('FHIRStarter').factory(serviceId, ['$filter', 'common', 'dataCache', 'fhirClient', 'fhirServers', allergyIntoleranceService]);

    function allergyIntoleranceService($filter, common, dataCache, fhirClient, fhirServers) {
        var dataCacheKey = 'localAllergyIntolerances';
        var linksCacheKey = 'linksAllergyIntolerances';
        var $q = common.$q;

        var service = {
            addAllergyIntolerance: addAllergyIntolerance,
            clearCache: clearCache,
            deleteCachedAllergyIntolerance: deleteCachedAllergyIntolerance,
            deleteAllergyIntolerance: deleteAllergyIntolerance,
            getCachedAllergyIntolerance: getCachedAllergyIntolerance,
            getCachedSearchResults: getCachedSearchResults,
            getAllergyIntolerance: getAllergyIntolerance,
            getAllergyIntoleranceReference: getAllergyIntoleranceReference,
            getAllergyIntolerances: getAllergyIntolerances,
            getAllergyIntolerancesForPatient: getAllergyIntolerancesForPatient,
            initializeNewAllergyIntolerance: initializeNewAllergyIntolerance,
            updateAllergyIntolerance: updateAllergyIntolerance
        };

        return service;

        function addAllergyIntolerance(resource) {
            _prepArrays(resource);
            var deferred = $q.defer();
            fhirServers.getActiveServer()
                .then(function (server) {
                    var url = server.baseUrl + "/AllergyIntolerance";
                    fhirClient.addResource(url, resource)
                        .then(function (results) {
                            deferred.resolve(results);
                        }, function (outcome) {
                            deferred.reject(outcome);
                        });
                });
            return deferred.promise
        }

        function clearCache() {
            dataCache.addToCache(dataCacheKey, null);
        }

        function deleteCachedAllergyIntolerance(hashKey, resourceId) {
            var deferred = $q.defer();
            deleteAllergyIntolerance(resourceId)
                .then(getCachedSearchResults,
                function (error) {
                    deferred.reject(error);
                })
                .then(removeFromCache,
                function (error) {
                    deferred.reject(error);
                })
                .then(function () {
                    deferred.resolve()
                });
            return deferred.promise;

            function removeFromCache(searchResults) {
                if (searchResults && searchResults.entry) {
                    var cachedAllergyIntolerances = searchResults.entry;
                    searchResults.entry = _.remove(cachedAllergyIntolerances, function (item) {
                        return item.$$hashKey !== hashKey;
                    });
                    searchResults.totalResults = (searchResults.totalResults - 1);
                    dataCache.addToCache(dataCacheKey, searchResults);
                }
                deferred.resolve();
            }
        }

        function deleteAllergyIntolerance(resourceId) {
            var deferred = $q.defer();
            fhirClient.deleteResource(resourceId)
                .then(function (results) {
                    deferred.resolve(results);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function getCachedAllergyIntolerance(hashKey) {
            var deferred = $q.defer();
            getCachedSearchResults()
                .then(getAllergyIntolerance,
                function () {
                    deferred.reject('AllergyIntolerance search results not found in cache.');
                });
            return deferred.promise;

            function getAllergyIntolerance(searchResults) {
                var cachedAllergyIntolerance;
                var cachedAllergyIntolerances = searchResults.entry;
                for (var i = 0, len = cachedAllergyIntolerances.length; i < len; i++) {
                    if (cachedAllergyIntolerances[i].$$hashKey === hashKey) {
                        cachedAllergyIntolerance = cachedAllergyIntolerances[i];
                        cachedAllergyIntolerance.content.resourceId = cachedAllergyIntolerance.id;
                        cachedAllergyIntolerance.content.hashKey = cachedAllergyIntolerance.$$hashKey;
                        break;
                    }
                }
                if (cachedAllergyIntolerance) {
                    deferred.resolve(cachedAllergyIntolerance.content)
                } else {
                    deferred.reject('AllergyIntolerance not found in cache: ' + hashKey);
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

        function getAllergyIntolerance(resourceId) {
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

        function getAllergyIntoleranceReference(baseUrl, input) {
            var deferred = $q.defer();
            fhirClient.getResource(baseUrl + '/AllergyIntolerance/?name=' + input + '&_count=20&_summary=true')
                .then(function (results) {
                    var allergyIntolerances = [];
                    if (results.data.entry) {
                        angular.forEach(results.data.entry,
                            function (item) {
                                if (item.content && item.content.resourceType === 'AllergyIntolerance') {
                                    //  var display = com
                                    allergyIntolerances.push({display: $filter('fullName')(item.content.name), reference: item.id});
                                }
                            });
                    }
                    if (allergyIntolerances.length === 0) {
                        allergyIntolerances.push({display: "No matches", reference: ''})
                    }
                    deferred.resolve(allergyIntolerances);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function getAllergyIntolerances(baseUrl, nameFilter, page, size) {
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
            params = params + '&_count=' + take;

            fhirClient.getResource(baseUrl + '/AllergyIntolerance/?' + params)
                .then(function (results) {
                    dataCache.addToCache(dataCacheKey, results.data);
                    deferred.resolve(results.data);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function initializeNewAllergyIntolerance() {
            return {
                "resourceType": "AllergyIntolerance"
                };
        }

        function getAllergyIntolerancesForPatient() {

        }

        function updateAllergyIntolerance(resourceVersionId, resource) {
            _prepArrays(resource);
            var deferred = $q.defer();
            fhirClient.updateResource(resourceVersionId, resource)
                .then(function (results) {
                    deferred.resolve(results);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function _addToCache(allergyIntolerance) {
            var cachedAllergyIntolerances = searchResults.entry;
            _.remove(cachedAllergyIntolerances,function (item) {
                return item.$$hashKey !== hashKey;
            }).then(function (reducedItems) {
                    searchResults.entry = reducedItems;
                    searchResults.totalResults = (searchResults.totalResults - 1);
                    dataCache.addToCache(dataCacheKey, searchResults);
                });
            deferred.resolve();
        }

        function _prepArrays(resource) {
            if (resource.address.length === 0) {
                resource.address = null;
            }
            if (resource.identifier.length === 0) {
                resource.identifier = null;
            }
            if (resource.contact.length === 0) {
                resource.contact = null;
            }
            if (resource.telecom.length === 0) {
                resource.telecom = null;
            }
            if (resource.photo.length === 0) {
                resource.photo = null;
            }
            if (resource.communication.length === 0) {
                resource.communication = null;
            }
            if (resource.link.length === 0) {
                resource.link = null;
            }
            if (resource.maritalStatus.coding && resource.maritalStatus.coding.length === 0) {
                resource.maritalStatus = null;
            }
            if (resource.gender.coding && resource.gender.coding.length === 0) {
                resource.gender = null;
            }
            return $q.when(resource);
        }
    }
})();