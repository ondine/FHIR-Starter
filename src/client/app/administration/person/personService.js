(function () {
    'use strict';

    var serviceId = 'personService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'dataCache', 'fhirClient', personService]);

    function personService(common, dataCache, fhirClient) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var $q = common.$q;

        var service = {
            addPerson: addPerson,
            updatePerson: updatePerson,
            getPerson: getPerson,
            deletePerson: deletePerson,
            getPersons: getPersons
        };

        return service;


        function addPerson(resource) {

        }

        function deletePerson(resourceId) {

        }

        function getPerson(resourceId) {

        }

        function getPersons(baseUrl, nameFilter, page, size) {
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

            fhirClient.getResource(baseUrl + '/RelatedPerson/_search?' + params)
                .then(function (data) {
                    dataCache.addToCache('persons', data.entry);
                    deferred.resolve(data);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function updatePerson(resourceId, resource) {

        }
    }
})();