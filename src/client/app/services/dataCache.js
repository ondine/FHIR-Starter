(function () {
    'use strict';

    var serviceId = 'dataCache';

    angular.module('FHIRStarter').factory(serviceId, ['$cacheFactory', dataCache]);

    function dataCache($cacheFactory) {

        var fhirCache = $cacheFactory('fhirCache', {capacity: 20});

        var service = {
            addToCache: addToCache,
            readFromCache: readFromCache,
            getCacheStats: getCacheStats,
            getItemFromCache: getItemFromCache
        };

        return service;

        function addToCache(key, value) {
            fhirCache.put(key, value);
        }

        function getCacheStats() {
            return fhirCache.info();
        }

        function getItemFromCache(hash, key) {
            var foundItem = null;
            if (isNaN(hash) === false) {
                var items = readFromCache(key);
                var hashInt = parseInt(hash);
                if (typeof items !== 'undefined') {
                    for (var i = 0, len = items.length; i < len; i++) {
                        if (items[i].$$hashKey === hashInt) {
                            foundItem = items[i];
                            break;
                        }
                    }
                }
            }
            return foundItem;
        }

        function readFromCache(key) {
            return fhirCache.get(key);
        }
    }
})();