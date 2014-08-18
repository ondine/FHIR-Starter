(function () {
    'use strict';

    var serviceId = 'locationService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'dataCache', 'fhirClient', 'fhirServers', locationService]);

    function locationService(common, dataCache, fhirClient, fhirServers) {
        var dataCacheKey = 'localLocations';
        var linksCacheKey = 'linksLocations';
        var itemCacheKey = 'contextLocation';
        var getLogFn = common.logger.getLogFn;
        var logWarning = getLogFn(serviceId, 'warning');
        var $q = common.$q;

        var service = {
            addLocation: addLocation,
            clearCache: clearCache,
            deleteCachedLocation: deleteCachedLocation,
            deleteLocation: deleteLocation,
            getCachedLocation: getCachedLocation,
            getCachedSearchResults: getCachedSearchResults,
            getLocation: getLocation,
            getLocationReference: getLocationReference,
            getLocations: getLocations,
            initializeNewLocation: initializeNewLocation,
            updateLocation: updateLocation
        };

        return service;

        function addLocation(resource) {
            _prepArrays(resource)
                .then(function (resource) {
                    resource.type.coding = _prepCoding(resource.type.coding);
                    resource.physicalType.coding = _prepCoding(resource.physicalType.coding);
                });
            var deferred = $q.defer();
            fhirServers.getActiveServer()
                .then(function (server) {
                    var url = server.baseUrl + "/Location";
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

        function deleteCachedLocation(hashKey, resourceId) {
            var deferred = $q.defer();
            deleteLocation(resourceId)
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
                if (angular.isUndefined(searchResults.entry)) {
                    logWarning('Location not found in cache: ' + hashKey);
                    deferred.resolve();
                } else {
                    var cachedLocations = searchResults.entry;
                    for (var i = 0, len = cachedLocations.length; i < len; i++) {
                        if (cachedLocations[i].$$hashKey === hashKey) {
                            cachedLocations.splice(i, 1);
                            searchResults.entry = cachedLocations;
                            searchResults.totalResults = (searchResults.totalResults - 1);
                            dataCache.addToCache(dataCacheKey, searchResults);
                            removed = true;
                            break;
                        }
                    }
                    if (removed) {
                        deferred.resolve();
                    } else {
                        logWarning('Location not found in cache: ' + hashKey);
                        deferred.resolve();
                    }
                }
            }
        }

        function deleteLocation(resourceId) {
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

        function getCachedLocation(hashKey) {
            var deferred = $q.defer();
            getCachedSearchResults()
                .then(getLocation,
                function () {
                    deferred.reject('Location search results not found in cache.');
                });
            return deferred.promise;

            function getLocation(searchResults) {
                var cachedLocation;
                var cachedLocations = searchResults.entry;
                cachedLocation = _.find(cachedLocations, { '$$hashKey': hashKey});
                if (cachedLocation) {
                    var selfLink = _.find(cachedLocation.link, { 'rel': 'self' });
                    cachedLocation.content.resourceId = cachedLocation.id;
                    cachedLocation.content.resourceVersionId = selfLink.href;
                    cachedLocation.content.hashKey = cachedLocation.$$hashKey;
                }
                if (cachedLocation) {
                    deferred.resolve(cachedLocation.content)
                } else {
                    deferred.reject('Location not found in cache: ' + hashKey);
                }
            }
        }

        function getLocation(resourceId) {
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

        function getLocations(baseUrl, nameFilter, page, size) {
            var deferred = $q.defer();
            var params = '';
            var take = size || 20;
            var skip = page ? (page - 1) * take : 0;

            if (angular.isUndefined(nameFilter)) {
                deferred.reject('Invalid search input');
            }
            params = nameFilter + '&_offset=' + skip + '&_count=' + take;

            fhirClient.getResource(baseUrl + '/Location/?name=' + nameFilter)
                .then(function (results) {
                    dataCache.addToCache(dataCacheKey, results.data);
                    deferred.resolve(results.data);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function getLocationReference(baseUrl, input) {
            var deferred = $q.defer();
            fhirClient.getResource(baseUrl + '/Location/?name=' + input + '&_count=20&_summary=true')
                .then(function (results) {
                    var locations = [];
                    if (results.data.entry) {
                        angular.forEach(results.data.entry,
                            function (item) {
                                if (item.content && item.content.resourceType === 'Location') {
                                    locations.push({display: item.content.name, reference: item.id});
                                }
                            });
                    }
                    if (locations.length === 0) {
                        locations.push({display: "No matches", reference: ''})
                    }
                    deferred.resolve(locations);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function initializeNewLocation() {
            return {
                "resourceType": "Location",
                "identifier": null,
                "name": null,
                "description": null,
                "type": { "coding": [] },
                "telecom": [],
                "address": null,
                "physicalType": { "coding": [] },
                "managingOrganization": null,
                "partOf": null,
                "position": null,
                "mode": null,
                "status": null}
        }

        function updateLocation(resourceVersionId, resource) {
            _prepArrays(resource)
                .then(function (resource) {
                    if (angular.isDefined(resource.type)) {
                        resource.type.coding = _prepCoding(resource.type.coding);
                    }
                    if (angular.isDefined(resource.physicalType)) {
                        resource.physicalType.coding = _prepCoding(resource.physicalType.coding);
                    }
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
            if (resource.telecom && resource.telecom.length === 0) {
                resource.telecom = null;
            }
            if (resource.identifier && resource.identifier.length === 0) {
                resource.identifier = null;
            }
            if (resource.type && resource.type.coding && resource.type.coding.length === 0) {
                resource.type = null;
            }
            if (resource.physicalType && resource.physicalType.coding && resource.physicalType.coding.length === 0) {
                resource.physicalType = null;
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