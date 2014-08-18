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

    var serviceId = 'organizationService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'dataCache', 'fhirClient', 'fhirServers', organizationService]);

    function organizationService(common, dataCache, fhirClient, fhirServers) {
        var dataCacheKey = 'localOrganizations';
        var linksCacheKey = 'linksOrganizations';
        var itemCacheKey = 'contextOrganization';
        var getLogFn = common.logger.getLogFn;
        var logWarning = getLogFn(serviceId, 'warning');
        var $q = common.$q;

        var service = {
            addOrganization: addOrganization,
            clearCache: clearCache,
            deleteCachedOrganization: deleteCachedOrganization,
            deleteOrganization: deleteOrganization,
            getCachedOrganization: getCachedOrganization,
            getCachedSearchResults: getCachedSearchResults,
            getOrganization: getOrganization,
            getOrganizationReference: getOrganizationReference,
            getOrganizations: getOrganizations,
            initializeNewOrganization: initializeNewOrganization,
            updateOrganization: updateOrganization
        };

        return service;

        function addOrganization(resource) {
            _prepArrays(resource)
                .then(function (resource) {
                    resource.type.coding = _prepCoding(resource.type.coding);
                });
            var deferred = $q.defer();
            fhirServers.getActiveServer()
                .then(function (server) {
                    var url = server.baseUrl + "/Organization";
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

        function deleteCachedOrganization(hashKey, resourceId) {
            var deferred = $q.defer();
            deleteOrganization(resourceId)
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
                var cachedOrganizations = searchResults.entry;
                for (var i = 0, len = cachedOrganizations.length; i < len; i++) {
                    if (cachedOrganizations[i].$$hashKey === hashKey) {
                        cachedOrganizations.splice(i, 1);
                        searchResults.entry = cachedOrganizations;
                        searchResults.totalResults = (searchResults.totalResults - 1);
                        dataCache.addToCache(dataCacheKey, searchResults);
                        removed = true;
                        break;
                    }
                }
                if (removed) {
                    deferred.resolve();
                } else {
                    logWarning('Organization not found in cache: ' + hashKey);
                    deferred.resolve();
                }
            }
        }

        function deleteOrganization(resourceId) {
            var deferred = $q.defer();
            fhirClient.deleteResource(resourceId)
                .then(function (results) {
                    deferred.resolve(results);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
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

        function getCachedOrganization(hashKey) {
            var deferred = $q.defer();
            getCachedSearchResults()
                .then(getOrganization,
                function () {
                    deferred.reject('Organization search results not found in cache.');
                });
            return deferred.promise;

            function getOrganization(searchResults) {
                var cachedOrganization;
                var cachedOrganizations = searchResults.entry;
                cachedOrganization = _.find(cachedOrganizations, { '$$hashKey': hashKey});
                if (cachedOrganization) {
                    var selfLink = _.find(cachedOrganization.link, { 'rel': 'self' });
                    cachedOrganization.content.resourceId = cachedOrganization.id;
                    cachedOrganization.content.resourceVersionId = selfLink.href;
                    cachedOrganization.content.hashKey = cachedOrganization.$$hashKey;
                }
                if (cachedOrganization) {
                    deferred.resolve(cachedOrganization.content)
                } else {
                    deferred.reject('Organization not found in cache: ' + hashKey);
                }
            }
        }

        function getOrganization(resourceId) {
            var deferred = $q.defer();
            fhirClient.getResource(resourceId)
                .then(function (results) {
                    dataCache.addToCache(dataCacheKey, results.data);
                    deferred.resolve(results.data);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function getOrganizations(baseUrl, nameFilter, page, size) {
            var deferred = $q.defer();
            var params = '';
            var take = size || 20;
            var skip = page ? (page - 1) * take : 0;

            if (angular.isUndefined(nameFilter)) {
                deferred.reject('Invalid search input');
            }
            params = nameFilter + '&_offset=' + skip + '&_count=' + take;

            fhirClient.getResource(baseUrl + '/Organization/?name=' + nameFilter)
                .then(function (results) {
                    dataCache.addToCache(dataCacheKey, results.data);
                    deferred.resolve(results.data);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function getOrganizationReference(baseUrl, input) {
            var deferred = $q.defer();
            fhirClient.getResource(baseUrl + '/Organization/?name=' + input + '&_count=20&_summary=true')
                .then(function (results) {
                    var organizations = [];
                    if (results.data.entry) {
                        angular.forEach(results.data.entry,
                            function (item) {
                                if (item.content && item.content.resourceType === 'Organization') {
                                    organizations.push({display: item.content.name, reference: item.id});
                                }
                            });
                    }
                    if (organizations.length === 0) {
                        organizations.push({display: "No matches", reference: ''})
                    }
                    deferred.resolve(organizations);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function initializeNewOrganization() {
            return {
                "resourceType": "Organization",
                "identifier": [],
                "type": { "coding": [] },
                "telecom": [],
                "contact": [],
                "address": [],
                "partOf": null,
                "location": [],
                "active": true};
        }

        function updateOrganization(resourceVersionId, resource) {
            _prepArrays(resource)
                .then(function (resource) {
                    resource.type.coding = _prepCoding(resource.type.coding);
                });
            var deferred = $q.defer();
            fhirClient.updateResource(resourceVersionId, resource)
                .then(function (results) {
                    deferred.resolve(results);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
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
            if (resource.location.length === 0) {
                resource.location = null;
            }
            return $q.when(resource);
        }

        function _prepCoding(coding) {
            var result = null;
            if (angular.isArray(coding) && angular.isDefined(coding[0])) {
                if (angular.isObject(coding[0])) {
                    result = coding;
                } else {
                    var parsedCoding = JSON.parse(coding[0]);
                    result = [];
                    result.push(parsedCoding ? parsedCoding : null);
                }
            }
            return result;
        }
    }
})();