(function () {
    'use strict';

    var serviceId = 'practitionerService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'dataCache', 'fhirClient', practitionerService]);

    function practitionerService(common, dataCache, fhirClient) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var $q = common.$q;

        var service = {
            addPractitioner: addPractitioner,
            updatePractitioner: updatePractitioner,
            getPractitioner: getPractitioner,
            deletePractitioner: deletePractitioner,
            getPractitioners: getPractitioners
        };

        return service;


        function addPractitioner(resource) {

        }

        function deletePractitioner(resourceId) {

        }

        function getPractitioner(resourceId) {

        }

        function getPractitioners(baseUrl, nameFilter, page, size) {
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

            fhirClient.getResource(baseUrl + '/Practitioner/_search?' + params)
                .then(function (data) {
                    dataCache.addToCache('practitioners', data.entry);
                    deferred.resolve(data);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function updatePractitioner(resourceId, resource) {

        }
    }
})();