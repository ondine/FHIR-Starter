(function () {
    'use strict';

    var serviceId = 'questionnaireService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'dataCache', 'fhirClient', questionnaireService]);

    function questionnaireService(common, dataCache, fhirClient) {
        var getLogFn = common.logger.getLogFn;
        var cacheKey = 'foundQuestionnaires';
        var isLoaded = false;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var $q = common.$q;


        var service = {
            addQuestionnaire: addQuestionnaire,
            deleteQuestionnaire: deleteQuestionnaire,
            getCachedQuestionnaire: getCachedQuestionnaire,
            getCachedSearchResults: getCachedSearchResults,
            getFilteredCount: getFilteredCount,
            getQuestionnaire: getQuestionnaire,
            getQuestionnairesCount: getQuestionnairesCount,
            getQuestionnaires: getQuestionnaires,
            updateQuestionnaire: updateQuestionnaire
        };

        return service;


        function addQuestionnaire(resource) {

        }

        function deleteQuestionnaire(resourceId) {

        }

        function getCachedSearchResults() {
            var deferred = $q.defer();
            var cachedSearchResults = dataCache.readFromCache(cacheKey);
            if (cachedSearchResults) {
                deferred.resolve(cachedSearchResults);
            } else {
                deferred.reject('Search results not cached.');
            }
            return deferred.promise;
        }

        function getFilteredCount(filter) {
            //TODO add filtering algorithm or Breeze
            return dataCache.readFromCache(cacheKey).length;
        }

        function getQuestionnaire(resourceId) {
            var deferred = $q.defer();
            getCachedSearchResults()
                .then(getQuestionnaire,
                function () {
                    deferred.reject('Questionnaire search results not found in cache.');
                });
            return deferred.promise;

            function getQuestionnaire(searchResults) {
                var cachedQuestionnaire;
                var cachedQuestionnaires = searchResults.entry;
                for (var i = 0, len = cachedQuestionnaires.length; i < len; i++) {
                    if (cachedQuestionnaires[i].$$hashKey === hashKey) {
                        cachedQuestionnaire = cachedQuestionnaires[i];
                        break;
                    }
                }
                if (cachedQuestionnaire) {
                    deferred.resolve(cachedQuestionnaire)
                } else {
                    deferred.reject('Questionnaire not found in cache: ' + hashKey);
                }
            }
        }

        function getCachedQuestionnaire(hashKey) {
            var deferred = $q.defer();
            _getAllLocal()
                .then(getQuestionnaire,
                function () {
                    deferred.reject('Questionnaire search results not found in cache.');
                });
            return deferred.promise;

            function getQuestionnaire(cachedEntries) {
                var cachedQuestionnaire;
                for (var i = 0, len = cachedEntries.length; i < len; i++) {
                    if (cachedEntries[i].$$hashKey === hashKey) {
                        cachedQuestionnaire = cachedEntries[i];
                        break;
                    }
                }
                if (cachedQuestionnaire) {
                    deferred.resolve(cachedQuestionnaire)
                } else {
                    deferred.reject('Questionnaire not found in cache: ' + hashKey);
                }
            }
        }

        function getQuestionnairesCount() {
            var deferred = $q.defer();
            if (_areQuestionnairesLoaded()) {
                _getAllLocal().then(function(data) {
                    deferred.resolve(data.length);
                });
            } else {
                return deferred.resolve(0);
            }
            return deferred.promise;
        }

        function getQuestionnaires(baseUrl, forceRemote, page, size, filter) {
            var deferred = $q.defer();
            var take = size || 20;
            var skip = page ? (page - 1) * take : 0;

            if (_areQuestionnairesLoaded() && !forceRemote) {
                _getAllLocal().then(getByPage);
            } else {
                fhirClient.getResource(baseUrl + '/Questionnaire')
                    .then(querySucceeded,
                    function (outcome) {
                        deferred.reject(outcome);
                    }).then(getByPage);
            }

            function getByPage(entries) {
                var pagedQuestionnaires;
                if (entries) {
                    if (entries.length < size) {
                        pagedQuestionnaires = entries;
                    } else {
                        var start = (skip < entries.length) ? skip : (entries - size);
                        var items = ((start + size) >= entries.length) ? (entries.length) : (start + size);
                        pagedQuestionnaires = entries.slice(start, items);
                    }
                }
                deferred.resolve(pagedQuestionnaires);
            }

            function querySucceeded(data) {
                _areQuestionnairesLoaded(true);
                log('Retrieved [Questionnaires] from remote FHIR server', data.entry.length)
                dataCache.addToCache(cacheKey, data.entry);
                return data.entry;
            }

            return deferred.promise;
        }

        function updateQuestionnaire(resourceId, resource) {

        }

        function _getAllLocal() {
            var cachedQuestionnaires = dataCache.readFromCache(cacheKey);
            return $q.when(cachedQuestionnaires);
        }

        function _areQuestionnairesLoaded(value) {
            if (value === undefined) {
                return isLoaded;
            }
            return isLoaded = true;
        }
    }
})();