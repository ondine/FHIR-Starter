'use strict';

FHIRStarter.factory('addressService',
    ['cacheData',
        function () {
            var addresses = [];

            var add = function (item) {
                var index = getIndex(item.$$hashKey);
                if (item.line.indexOf('\n') > -1) {
                    item.line = item.line.split('\n');
                }
                if (index > -1) {
                    addresses[index] = item;
                } else {
                    addresses.push(item);
                }
            };

            var remove = function (item) {
                var index = getIndex(item.$$hashKey);
                addresses.splice(index, 1);
            };

            var init = function (items) {
                if (angular.isArray(items)) {
                    addresses = items;
                } else {
                    addresses = [];
                }
            };

            var reset = function () {
                while (addresses.length > 0) {
                    addresses.pop();
                }
            };

            var getAll = function () {
                return addresses;
            };

            var getStatesOfUSA = function () {
                return ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
            };

            var getIndex = function (hashKey) {
                if (angular.isUndefined(hashKey) === false) {
                    for (var i = 0, len = addresses.length; i < len; i++) {
                        if (addresses[i].$$hashKey === hashKey) {
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
                getStatesOfUSA: getStatesOfUSA,
                reset: reset
            }
        }])
;