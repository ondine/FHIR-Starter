'use strict';

FHIRStarter.factory('identifierService',
    ['cacheData',
        function () {
            var identifiers = [];

            var add = function (item) {
                var index = getIndex(item.$$hashKey);
                if (index > -1) {
                    identifiers[index] = item;
                } else {
                    identifiers.push(item);
                }
            };

            var remove = function (item) {
                var index = getIndex(item.$$hashKey);
                identifiers.splice(index, 1);
            };

            var init = function (items) {
                if (angular.isArray(items)) {
                    identifiers = items;
                } else {
                    identifiers = [];
                }
            };

            var getAll = function () {
                return identifiers;
            };

            var reset = function () {
                while (identifiers.length > 0) {
                    identifiers.pop();
                }
            };

            var getIndex = function (hashKey) {
                if (angular.isUndefined(hashKey) === false) {
                    for (var i = 0, len = identifiers.length; i < len; i++) {
                        if (identifiers[i].$$hashKey === hashKey) {
                            return i;
                        }
                    }
                }
                return -1;
            };

            return {
                add: add,
                remove: remove,
                getAll: getAll,
                init: init,
                reset: reset
            }
        }]);