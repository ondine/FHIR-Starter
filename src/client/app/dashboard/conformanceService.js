/**
 * Copyright 2014 Peter Bernhardt, et. al.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
(function () {
    'use strict';

    var serviceId = 'conformanceService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'dataCache', 'fhirClient', conformanceService]);

    function conformanceService(common, dataCache, fhirClient) {
        var $q = common.$q;

        var service = {
            getConformance: getConformance,
            clearCache: clearCache
        };

        return service;

        function getConformance(baseUrl) {
            var deferred = $q.defer();

            var cachedData = dataCache.readFromCache('conformance');
            if (cachedData) {
                deferred.resolve(cachedData);
            } else {
                fhirClient.getResource(baseUrl + '/metadata')
                    .then(function (results) {
                        dataCache.addToCache('conformance', results.data);
                        deferred.resolve(results.data);
                    }, function (outcome) {
                        deferred.reject(outcome);
                    });
            }
            return deferred.promise;
        }

        function clearCache() {
            dataCache.addToCache('conformance', null);
        }
    }
})();