(function () {
    'use strict';

    var serviceId = 'telecomService';

    angular.module('FHIRStarter').factory(serviceId, ['common', telecomService]);

    function telecomService(common) {
        var telecoms = [];
        var home = true;
        var mobile = true;

        var service = {
            add: add,
            remove: remove,
            getAll: getAll,
            init: init,
            reset: reset,
            supportHome: supportHome,
            supportMobile: supportMobile
        }

        return service;

        function add(item) {
            var index = getIndex(item.$$hashKey);
            if (index > -1) {
                telecoms[index] = item;
            } else {
                telecoms.push(item);
            }
        }

        function getAll() {
            return telecoms;
        }

        function getIndex(hashKey) {
            if (angular.isUndefined(hashKey) === false) {
                for (var i = 0, len = telecoms.length; i < len; i++) {
                    if (telecoms[i].$$hashKey === hashKey) {
                        return i;
                    }
                }
            }
            return -1;
        }

        function init(items, showHome, showMobile) {
            home = showHome;
            mobile = showMobile;
            if (angular.isArray(items)) {
                telecoms = items;
            } else {
                telecoms = [];
            }
        }

        function remove(item) {
            var index = getIndex(item.$$hashKey);
            telecoms.splice(index, 1);
        }

        function reset() {
            while (telecoms.length > 0) {
                telecoms.pop();
            }
        }

        function supportHome() {
            return home;
        }

        function supportMobile() {
            return mobile;
        }
    }
})();