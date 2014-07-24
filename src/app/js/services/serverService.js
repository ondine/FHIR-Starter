'use strict';

FHIRStarter.factory('serverService',
    ['$cookieStore', '$log', 'cacheData',
    function ($cookieStore, $log, cacheData) {
        var getServerById = function (id) {
            var servers = getAllServers();
            for (var i = 0, len = servers.length; i < len; i++) {
                if (servers[i].id === id) {
                    return servers[i];
                }
            }
            return null;
        };

        var getAllServers = function () {
            var baseList = [
                {
                    "id": 0,
                    "name": "Furore Spark",
                    "baseUrl": "http://spark.furore.com/fhir",
                    "secure": false
                },
                {
                    "id": 1,
                    "name": "HAPI",
                    "baseUrl": "http://fhirtest.uhn.ca/base",
                    "secure": false
                },
                {
                    "id": 2,
                    "name": "Health Intersections",
                    "baseUrl": "http://fhir.healthintersections.com.au/open",
                    "secure": false
                },
                {
                    "id": 3,
                    "name": "Oridashi",
                    "baseUrl": "http://demo.oridashi.com.au:8190",
                    "secure": false
                },
                {
                    "id": 4,
                    "name": "Orion Health Blaze",
                    "baseUrl": "https://fhir.orionhealth.com/blaze/fhir",
                    "secure": false
                },
                {
                    "id": 5,
                    "name": "SMART",
                    "baseUrl": "https://fhir-open-api.smartplatforms.org",
                    "secure": false
                }
            ];
            var servers = cacheData.readFromCache('servers');
            if (typeof servers === 'undefined') {
                servers = baseList;
                cacheData.addToCache('servers', servers);
            }
            return servers;
        };

        var getActiveServer = function () {
            var activeServer = cacheData.readFromCache('activeServer');
            if (typeof activeServer === 'undefined') {
                $log.info("Active server is not set: try cookie");
                activeServer = $cookieStore.get('server');
            }
            if (typeof activeServer === 'undefined') {
                $log.info("Server cookie not found: using default server");
                activeServer = getAllServers()[0];
            }

            return activeServer;
        };

        var setActiveServer = function(server) {
            cacheData.addToCache('server', server);
            $cookieStore.put('server', server);
        };

        var addNewServer = function(server) {
            if (typeof server !== 'undefined') {
                var serverList = getAllServers();
                for (var i = 0, len = serverList.length; i < len; i++) {
                    if (serverList[i].baseUrl === server.baseUrl) {
                        return;
                    }
                }
                server.id = serverList.length;
                serverList.push(server);
                cacheData.addToCache('servers', serverList);
            }
        };

         return {
            getAllServers: getAllServers,
            getServerById: getServerById,
            getActiveServer: getActiveServer,
            setActiveServer: setActiveServer,
            addNewServer: addNewServer
        };
    }]);

