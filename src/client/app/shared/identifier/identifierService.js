(function () {
    'use strict';

    var serviceId = 'identifierService';

    angular.module('FHIRStarter').factory(serviceId, ['common', identifierService]);

    function identifierService(common) {
        var identifiers = [];
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
                identifiers[index] = item;
            } else {
                identifiers.push(item);
            }
        }

        function getAll() {
            return _.compact(identifiers);
        }

        function getIndex(hashKey) {
            if (angular.isUndefined(hashKey) === false) {
                for (var i = 0, len = identifiers.length; i < len; i++) {
                    if (identifiers[i].$$hashKey === hashKey) {
                        return i;
                    }
                }
            }
            return -1;
        }

        function init(items) {
            if (angular.isArray(items)) {
                identifiers = items;
            } else {
                identifiers = [];
            }
        }

        function remove(item) {
            var index = getIndex(item.$$hashKey);
            identifiers.splice(index, 1);
        }

        function reset() {
            while (identifiers.length > 0) {
                identifiers.pop();
            }
        }
    }
})();