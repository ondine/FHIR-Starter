(function () {
    'use strict';

    var serviceId = 'addressService';

    angular.module('FHIRStarter').factory(serviceId, ['common', addressService]);

    function addressService(common) {
        var addresses = [];
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);


        var service = {
            add: add,
            remove: remove,
            getAll: getAll,
            init: init,
            reset: reset
        }

        return service;

        function add(item) {
            var index = getIndex(item.$$hashKey);
            if (index > -1) {
                addresses[index] = item;
            } else {
                addresses.push(item);
            }
        }

        function getAll() {
            return addresses;
        }

        function getIndex(hashKey) {
            if (angular.isUndefined(hashKey) === false) {
                for (var i = 0, len = addresses.length; i < len; i++) {
                    if (addresses[i].$$hashKey === hashKey) {
                        return i;
                    }
                }
            }
            return -1;
        }

        function init(items) {
            if (angular.isArray(items)) {
                addresses = items;
            } else {
                addresses = [];
            }
        }

        function remove(item) {
            var index = getIndex(item.$$hashKey);
            addresses.splice(index, 1);
        }

        function reset() {
            while (addresses.length > 0) {
                addresses.pop();
            }
        }
    }
})();