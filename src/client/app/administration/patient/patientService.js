(function () {
    'use strict';

    var serviceId = 'patientService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'dataCache', 'fhirClient', patientService]);

    function patientService(common, dataCache, fhirClient) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var $q = common.$q;

        var service = {
            addPatient: addPatient,
            deletePatient: deletePatient,
            getCachedPatient: getCachedPatient,
            getCachedSearchResults: getCachedSearchResults,
            getPatient: getPatient,
            getPatients: getPatients,
            updatePatient: updatePatient
        };

        return service;


        function addPatient(resource) {

        }

        function deletePatient(resourceId) {

        }

        function getCachedSearchResults() {
            var deferred = $q.defer();
            var cachedSearchResults = dataCache.readFromCache('foundPatients');
            if (cachedSearchResults) {
                deferred.resolve(cachedSearchResults);
            } else {
                deferred.reject('Search results not cached.');
            }
            return deferred.promise;
        }

        function getPatient(resourceId) {

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
                        break;
                    }
                }
                if (cachedPatient) {
                    deferred.resolve(cachedPatient)
                } else {
                    deferred.reject('Patient not found in cache: ' + hashKey);
                }
            }
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
            params = params + '&_offset=' + skip + '&_count=' + take;

            fhirClient.getResource(baseUrl + '/Patient/_search?' + params)
                .then(function (data) {
                    dataCache.addToCache('foundPatients', data);
                    deferred.resolve(data);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function updatePatient(resourceId, resource) {

        }

        function searchPatients(baseUrl, name, pageSize, offset) {
            var deferred = $q.defer();

            if (angular.isUndefined(name)) {
                deferred.reject('Invalid search input');
            }

            var params = '';
            var names = name.split(' ');
            if (names.length === 1) {
                params = 'family=' + names[0];
            } else {
                params = 'given=' + names[0] + '&family=' + names[1] + '&search-offset=' + offset + '&_count=' + pageSize;
            }

            fhirClient.getResource(baseUrl + '/Patient/_search?' + params)
                .then(function (data) {
                    dataCache.addToCache('patients', data.entry);
                    deferred.resolve(data);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }
    }
})();