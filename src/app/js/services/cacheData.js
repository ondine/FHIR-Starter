'use strict';

FHIRStarter.factory('cacheData',
    ['cacheService',
        function (cacheService) {
            var addToCache = function (key, value) {
                cacheService.put(key, value);
            };

            var readFromCache = function (key) {
                return cacheService.get(key);
            };

            var getCacheStats = function () {
                return cacheService.info();
            };

            var getItemFromCache = function (hash, key) {
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
            };

            return {
                addToCache: addToCache,
                readFromCache: readFromCache,
                getCacheStats: getCacheStats,
                getItemFromCache: getItemFromCache
            };
        }]);