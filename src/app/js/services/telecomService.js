'use strict';

FHIRStarter.factory('telecomService',
    ['cacheData',
        function () {
            var telecoms = [];

            var add = function (item) {
                var index = getIndex(item.$$hashKey);
                if (index > -1) {
                    telecoms[index] = item;
                } else {
                    telecoms.push(item);
                }
            };

            var remove = function (item) {
                var index = getIndex(item.$$hashKey);
                telecoms.splice(index, 1);
            };

            var init = function (items) {
                if (angular.isArray(items)) {
                    telecoms = items;
                } else {
                    telecoms = [];
                }
            };

            var getAll = function () {
                return telecoms;
            }

            var getIndex = function (hashKey) {
                if (angular.isUndefined(hashKey) === false) {
                    for (var i = 0, len = telecoms.length; i < len; i++) {
                        if (telecoms[i].$$hashKey === hashKey) {
                            return i;
                        }
                    }
                }
                return -1;
            };

            var reset = function () {
                while (telecoms.length > 0) {
                    telecoms.pop();
                }
            };

            return {
                add: add,
                remove: remove,
                getAll: getAll,
                init: init,
                reset: reset
            }
        }]);