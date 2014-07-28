(function () {
    'use strict';

    var serviceId = 'organizationService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'config', 'fhirClient', organizationService]);

    function organizationService(common, config, fhirClient) {
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

        function searchOrganizations(name) {
            var organizations;

            var url = config.fhirServerUrl + "/Organization/_search?name=" + name;

            return fhirClient.getResource(url).then(searchSucceeded, _searchFailed);

            function searchSucceeded(data) {
                organizations = data.entry;
                log('Retrieved [Organizations] from the remote FHIR server', organizations.length, true);
                return organizations;
            }
        }

        function _searchFailed(error) {
            var msg = config.appErrorPrefix + 'Error retrieving Organization data. [HTTP Status: ' + error.status + ']' + error.outcome;
            logError(msg, error);
            throw error;
        }
    }
})();