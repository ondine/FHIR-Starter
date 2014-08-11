(function () {
    'use strict';

    var serviceId = 'humanNameService';

    angular.module('FHIRStarter').factory(serviceId, ['common', humanNameService]);

    function humanNameService(common) {
        var humanNames = [];
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
                humanNames[index] = item;
            } else {
                humanNames.push(item);
            }
        }

        function getAll() {
            return _.compact(humanNames);
        }

        function getIndex(hashKey) {
            if (angular.isUndefined(hashKey) === false) {
                for (var i = 0, len = humanNames.length; i < len; i++) {
                    if (humanNames[i].$$hashKey === hashKey) {
                        return i;
                    }
                }
            }
            return -1;
        }

        function init(items) {
            if (angular.isArray(items)) {
                humanNames = items;
            } else {
                humanNames = [];
            }
        }

        function remove(item) {
            var index = getIndex(item.$$hashKey);
            humanNames.splice(index, 1);
        }

        function reset() {
            while (humanNames.length > 0) {
                humanNames.pop();
            }
        }
    }
})();