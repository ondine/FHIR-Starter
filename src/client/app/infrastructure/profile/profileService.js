﻿(function () {
    'use strict';

    var serviceId = 'profileService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'dataCache', 'fhirClient', profileService]);

    function profileService(common, dataCache, fhirClient) {
        var getLogFn = common.logger.getLogFn;
        var dataCacheKey = 'localProfiles';
        var linksCacheKey = 'linksProfiles';
        var isLoaded = false;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var $q = common.$q;


        var service = {
            addProfile: addProfile,
            deleteProfile: deleteProfile,
            getCachedProfile: getCachedProfile,
            getFilteredCount: getFilteredCount,
            getRemoteProfile: getRemoteProfile,
            getProfilesCount: getProfilesCount,
            getProfiles: getProfiles,
            updateProfile: updateProfile
        };

        return service;

        function addProfile(baseUrl) {
            var deferred = $q.defer();
            var id = common.generateUUID();

            fhirClient.addResource(baseUrl + '/Profile/' + id)
                .then(function (data) {
                    deferred.resolve(data);
                },
                function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function deleteProfile(resourceId) {
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

        function getRemoteProfile(resourceId) {
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

        function getCachedProfile(hashKey) {
            var deferred = $q.defer();
            _getAllLocal()
                .then(getProfile,
                function () {
                    deferred.reject('Profile search results not found in cache.');
                });
            return deferred.promise;

            function getProfile(cachedEntries) {
                var cachedProfile;
                for (var i = 0, len = cachedEntries.length; i < len; i++) {
                    if (cachedEntries[i].$$hashKey === hashKey) {
                        cachedProfile = cachedEntries[i];
                        break;
                    }
                }
                if (cachedProfile) {
                    deferred.resolve(cachedProfile)
                } else {
                    deferred.reject('Profile not found in cache: ' + hashKey);
                }
            }
        }

        function getProfilesCount() {
            var deferred = $q.defer();
            if (_areProfilesLoaded()) {
                _getAllLocal().then(function (data) {
                    deferred.resolve(data.length);
                });
            } else {
                return deferred.resolve(0);
            }
            return deferred.promise;
        }

        function getProfiles(forceRemote, baseUrl, page, size, filter) {
            var deferred = $q.defer();
            var take = size || 20;
            var skip = page ? (page - 1) * take : 0;

            if (_areProfilesLoaded() && !forceRemote) {
                _getAllLocal().then(getByPage);
            } else {
                fhirClient.getResource(baseUrl + '/Profile/_search?_count=500')
                    .then(querySucceeded,
                    function (outcome) {
                        deferred.reject(outcome);
                    }).then(getByPage);
            }

            function getByPage(entries) {
                var pagedProfiles;
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
                    pagedProfiles = filteredEntries;
                } else {
                    var start = (skip < filteredEntries.length) ? skip : (filteredEntries - size);
                    var items = ((start + size) >= filteredEntries.length) ? (filteredEntries.length) : (start + size);
                    pagedProfiles = filteredEntries.slice(start, items);
                }
                deferred.resolve(pagedProfiles);
            }

            function querySucceeded(data) {
                _areProfilesLoaded(true);
                log('Retrieved ' + data.entry.length + ' of ' + data.totalResults + ' available [Profiles] from remote FHIR server', data.entry.length)
                dataCache.addToCache(dataCacheKey, data.entry);
                return data.entry;
            }

            return deferred.promise;
        }

        function updateProfile(resourceId, resource) {
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
            var cachedProfiles = dataCache.readFromCache(dataCacheKey);
            return $q.when(cachedProfiles);
        }

        function _areProfilesLoaded(value) {
            if (value === undefined) {
                return isLoaded;
            }
            return isLoaded = true;
        }
    }
})();