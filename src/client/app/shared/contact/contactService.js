(function () {
    'use strict';

    var serviceId = 'contactService';

    angular.module('FHIRStarter').factory(serviceId, ['common', contactService]);

    function contactService(common) {
        var contacts = [];
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
                contacts[index] = item;
            } else {
                contacts.push(item);
            }
        }

        function getAll() {
            return contacts;
        }

        function getIndex(hashKey) {
            if (angular.isUndefined(hashKey) === false) {
                for (var i = 0, len = contacts.length; i < len; i++) {
                    if (contacts[i].$$hashKey === hashKey) {
                        return i;
                    }
                }
            }
            return -1;
        }

        function init(items) {
            if (angular.isArray(items)) {
                contacts = items;
            } else {
                contacts = [];
            }
        }

        function remove(item) {
            var index = getIndex(item.$$hashKey);
            contacts.splice(index, 1);
        }

        function reset() {
            while (contacts.length > 0) {
                contacts.pop();
            }
        }
    }
})();