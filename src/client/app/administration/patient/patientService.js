﻿/**
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

    var serviceId = 'patientService';

    angular.module('FHIRStarter').factory(serviceId, ['$filter', 'common', 'dataCache', 'fhirClient', 'fhirServers', patientService]);

    function patientService($filter, common, dataCache, fhirClient, fhirServers) {
        var dataCacheKey = 'localPatients';
        var linksCacheKey = 'linksPatients';
        var itemCacheKey = 'contextPatient';
        var $q = common.$q;

        var service = {
            addPatient: addPatient,
            clearCache: clearCache,
            deleteCachedPatient: deleteCachedPatient,
            deletePatient: deletePatient,
            getCachedPatient: getCachedPatient,
            getCachedSearchResults: getCachedSearchResults,
            getPatient: getPatient,
            getPatientReference: getPatientReference,
            getPatients: getPatients,
            initializeNewPatient: initializeNewPatient,
            updatePatient: updatePatient
        };

        return service;

        function addPatient(resource) {
            _prepArrays(resource);
            var deferred = $q.defer();
            fhirServers.getActiveServer()
                .then(function (server) {
                    var url = server.baseUrl + "/Patient";
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

        function deleteCachedPatient(hashKey, resourceId) {
            var deferred = $q.defer();
            deletePatient(resourceId)
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
                    var cachedPatients = searchResults.entry;
                    searchResults.entry = _.remove(cachedPatients, function (item) {
                        return item.$$hashKey !== hashKey;
                    });
                    searchResults.totalResults = (searchResults.totalResults - 1);
                    dataCache.addToCache(dataCacheKey, searchResults);
                }
                deferred.resolve();
            }
        }

        function deletePatient(resourceId) {
            var deferred = $q.defer();
            fhirClient.deleteResource(resourceId)
                .then(function (results) {
                    deferred.resolve(results);
                }, function (outcome) {
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

        function getPatientReference(baseUrl, input) {
            var deferred = $q.defer();
            fhirClient.getResource(baseUrl + '/Patient/?name=' + input + '&_count=20&_summary=true')
                .then(function (results) {
                    var patients = [];
                    if (results.data.entry) {
                        angular.forEach(results.data.entry,
                            function (item) {
                                if (item.content && item.content.resourceType === 'Patient') {
                                  //  var display = com
                                    patients.push({display: $filter('fullName')(item.content.name), reference: item.id});
                                }
                            });
                    }
                    if (patients.length === 0) {
                        patients.push({display: "No matches", reference: ''})
                    }
                    deferred.resolve(patients);
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
            params = params + '&_count=' + take;

            fhirClient.getResource(baseUrl + '/Patient/?' + params)
                .then(function (results) {
                    dataCache.addToCache(dataCacheKey, results.data);
                    deferred.resolve(results.data);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function initializeNewPatient() {
            return {
                "resourceType": "Patient",
                "name": [],
                "gender": undefined,
                "birthDate": null,
                "maritalStatus": undefined,
                //              "multipleBirth": false,
                "telecom": [],
                "address": [],
                "photo": [],
                "communication": [],
                "managingOrganization": null,
                "contact": [],
                "link": [],
                "active": true};
        }

        function updatePatient(resourceVersionId, resource) {
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

        function _addToCache(patient) {
            var cachedPatients = searchResults.entry;
            _.remove(cachedPatients,function (item) {
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