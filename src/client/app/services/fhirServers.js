(function () {
    'use strict';

    var serviceId = 'fhirServers';

    angular.module('FHIRStarter').factory(serviceId, ['$cookieStore', 'common', 'dataCache', fhirServers]);

    function fhirServers($cookieStore, common, dataCache) {
        var $q = common.$q;

        var service = {
            getAllServers: getAllServers,
            getServerById: getServerById,
            getActiveServer: getActiveServer,
            setActiveServer: setActiveServer,
        };

        return service;

        function getActiveServer() {
            var activeServer = dataCache.readFromCache('activeServer');
            if (angular.isUndefined(activeServer)) {
                activeServer = $cookieStore.get('server');
            }
            if (angular.isUndefined(activeServer)) {
                getAllServers()
                    .then(function (servers) {
                        activeServer = servers[0];
                        setActiveServer(activeServer);
                    });
            }
            return $q.when(activeServer);
        }

        function setActiveServer(server) {
            dataCache.addToCache('server', server);
            $cookieStore.put('server', server);
        }

        function getAllServers() {
            var deferred = $q.defer();
            try {
                var baseList = [
                    {
                        "id": 0,
                        "name": "FHIR Place",
                        "baseUrl": "http://try-fhirplace.hospital-systems.com",
                        "secure": false
                    },
                    {
                        "id": 1,
                        "name": "Furore Spark",
                        "baseUrl": "http://spark.furore.com/fhir",
                        "secure": false
                    },
                    {
                        "id": 2,
                        "name": "HAPI",
                        "baseUrl": "http://fhirtest.uhn.ca/base",
                        "secure": false
                    },
                    {
                        "id": 3,
                        "name": "Health Intersections",
                        "baseUrl": "http://fhir.healthintersections.com.au/open",
                        "secure": false
                    },
                    {
                        "id": 4,
                        "name": "Health Intersections (DEV)",
                        "baseUrl": "http://fhir-dev.healthintersections.com.au/open",
                        "secure": false
                    },
                    {
                        "id": 5,
                        "name": "Oridashi",
                        "baseUrl": "http://demo.oridashi.com.au:8190",
                        "secure": false
                    },
                    {
                        "id": 6,
                        "name": "Orion Health Blaze",
                        "baseUrl": "https://fhir.orionhealth.com/blaze/fhir",
                        "secure": false
                    },
                    {
                        "id": 7,
                        "name": "SMART",
                        "baseUrl": "https://fhir-open-api.smartplatforms.org",
                        "secure": false
                    },
                ];
                var servers = dataCache.readFromCache('servers');
                if (angular.isUndefined(servers)) {
                    servers = baseList;
                    dataCache.addToCache('servers', servers);
                }
                deferred.resolve(servers);
            } catch (e) {
                deferred.reject(e);
            }
            return deferred.promise;
        }

        function getServerById(id) {
            var deferred = $q.defer();
            var server = null;
            getAllServers()
                .then(function (servers) {
                    for (var i = 0, len = servers.length; i < len; i++) {
                        if (servers[i].id === id) {
                            server = servers[i];
                            break;
                        }
                    }
                    return deferred.resolve(server);
                });
            return deferred.promise;
        }
    }
})();