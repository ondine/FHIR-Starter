(function () {
    'use strict';

    var serviceId = 'organizationService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'dataCache', 'fhirClient', organizationService]);

    function organizationService(common, dataCache, fhirClient) {
        var dataCacheKey = 'localOrganizations';
        var linksCacheKey = 'linksOrganizations';
        var itemCacheKey = 'contextOrganization';
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var $q = common.$q;

        var service = {
            addOrganization: addOrganization,
            deleteCachedOrganization: deleteCachedOrganization,
            deleteOrganization: deleteOrganization,
            getCachedOrganization: getCachedOrganization,
            getOrganization: getOrganization,
            getOrganizations: getOrganizations,
            initializeNewOrganization: initializeNewOrganization,
            updateOrganization: updateOrganization
        };

        return service;

        function addOrganization(resource) {

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
                    logError('Organization not found in cache: ' + hashKey);
                    deferred.resolve();
                }
            }
        }

        function deleteOrganization(resourceId) {
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
                for (var i = 0, len = cachedOrganizations.length; i < len; i++) {
                    if (cachedOrganizations[i].$$hashKey === hashKey) {
                        cachedOrganization = cachedOrganizations[i];
                        cachedOrganization.content.resourceId = cachedOrganization.id;
                        cachedOrganization.content.hashKey = cachedOrganization.$$hashKey;
                        break;
                    }
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
                .then(function (data) {
                    dataCache.addToCache(dataCacheKey, data);
                    deferred.resolve(data);
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
            params = nameFilter + '&search-offset=' + skip + '&_count=' + take;

            fhirClient.getResource(baseUrl + '/Organization/_search?name=' + params)
                .then(function (data) {
                    dataCache.addToCache(dataCacheKey, data);
                    deferred.resolve(data);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function initializeNewOrganization() {
            return {
                "resourceType": "Organization",
                "identifier": null,
                "type": { "coding": [] },
                "telecom": null,
                "contact": null,
                "address": null,
                "partOf": null,
                "location": null,
                "active": true};
        }

        function updateOrganization(resourceId, resource) {

        }
    }
})();