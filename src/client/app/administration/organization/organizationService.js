(function () {
    'use strict';

    var serviceId = 'organizationService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'dataCache', 'fhirClient', organizationService]);

    function organizationService(common, dataCache, fhirClient) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var $q = common.$q;

        var service = {
            add: addOrganization,
            update: updateOrganization,
            get: getOrganization,
            delete: deleteOrganization,
            search: searchOrganizations
        };

        return service;

        function addOrganization(resource) {
        }

        function updateOrganization(resourceId, resource) {

        }

        function getOrganization(resourceId) {

        }

        function deleteOrganization(resourceId) {

        }

        function searchOrganizations(baseUrl, name) {
            var deferred = $q.defer();

            fhirClient.getResource(baseUrl + '/Organization/_search?name=' + name)
                .then(function (data) {
                    dataCache.addToCache('organizations', data.entry);
                    deferred.resolve(data.entry);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }
    }
})();