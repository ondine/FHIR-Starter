(function () {
    'use strict';

    var serviceId = 'profileService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'dataCache', 'fhirClient', profileService]);

    function profileService(common, dataCache, fhirClient) {
        var dataCacheKey = 'localProfiles';
        var linksCacheKey = 'linksProfiles';
        var isLoaded = false;
        var _isFetching = false;
        var $q = common.$q;


        var service = {
            addProfile: addProfile,
            clearCache: clearCache,
            deleteProfile: deleteProfile,
            getCachedProfile: getCachedProfile,
            getFilteredCount: getFilteredCount,
            getProfileQuestionnaire: getProfileQuestionnaire,
            getRemoteProfile: getRemoteProfile,
            getProfilesCount: getProfilesCount,
            getProfiles: getProfiles,
            isFetching: isFetching,
            updateProfile: updateProfile
        };

        return service;

        function addProfile(baseUrl) {
            var deferred = $q.defer();
            var id = common.generateUUID();

            fhirClient.addResource(baseUrl + '/Profile/' + id)
                .then(function (results) {
                    deferred.resolve(results);
                },
                function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function clearCache() {
            dataCache.addToCache(dataCacheKey, null);
        }

        function deleteProfile(resourceId) {
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

        function getProfileQuestionnaire(hashKey) {
            var deferred = $q.defer();
            getCachedProfile(hashKey)
                .then(function (profile) {
                    fhirClient.getResource(profile.id + '/$questionnaire')
                        .then(function (results) {
                            deferred.resolve(results.data);
                        },
                        function (outcome) {
                            deferred.reject(outcome);
                        });
                });
            return deferred.promise;
        }

        function getRemoteProfile(resourceId) {
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
                _isFetching = true;
                fhirClient.getResource(baseUrl + '/Profile?_count=200')
                    .then(querySucceeded,
                    function (outcome) {
                        deferred.reject(outcome);
                    }).then(getByPage);
            }

            function getByPage(entries) {
                var pagedProfiles;
                var filteredEntries = [];

                if (angular.isUndefined(entries)) {
                    deferred.resolve();
                } else {
                    if (filter) {
                        for (var i = 0, len = entries.length; i < len; i++) {
                            if (filter(entries[i])) {
                                filteredEntries.push(entries[i]);
                            }
                        }
                    } else {
                        filteredEntries = entries;
                    }

                    if (angular.isDefined(filteredEntries) && angular.isArray(filteredEntries)) {
                        if (filteredEntries.length < size) {
                            pagedProfiles = filteredEntries;
                        }
                        else {
                            var start = (skip < filteredEntries.length) ? skip : (filteredEntries - size);
                            var items = ((start + size) >= filteredEntries.length) ? (filteredEntries.length) : (start + size);
                            pagedProfiles = filteredEntries.slice(start, items);
                        }
                    }
                    deferred.resolve(pagedProfiles);
                }
            }

            function querySucceeded(results) {
                _areProfilesLoaded(true);
                dataCache.addToCache(dataCacheKey, results.data);
                _isFetching = false;
                return results.data.entry;
            }

            return deferred.promise;
        }

        function isFetching() {
            return _isFetching;
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
            var entries = [];
            var cachedProfiles = dataCache.readFromCache(dataCacheKey);
            if (angular.isObject(cachedProfiles) && angular.isDefined(cachedProfiles.entry)) {
                entries = cachedProfiles.entry;
            }
            return $q.when(entries);
        }

        function _areProfilesLoaded(value) {
            if (value === undefined) {
                return isLoaded;
            }
            return isLoaded = true;
        }
    }
})
    ();