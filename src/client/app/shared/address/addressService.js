(function () {
    'use strict';

    var serviceId = 'addressService';

    angular.module('FHIRStarter').factory(serviceId, ['$http', 'common', addressService]);

    function addressService($http, common) {
        var addresses = [];
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var $q = common.$q;
        var home = true;

        var service = {
            add: add,
            remove: remove,
            getAll: getAll,
            init: init,
            reset: reset,
            searchGoogle: searchGoogle,
            supportHome: supportHome
        }

        return service;

        function add(item) {
            var index = getIndex(item.$$hashKey);

            if (index > -1) {
                addresses[index] = updateFromFormattedAddress(item);
            } else {
                addresses.push(updateFromFormattedAddress(item));
            }

            // Optimized for complete US addresses (TODO: fully support international)
            function updateFromFormattedAddress(item) {
                var address = {};
                address.line = [];
                if (item.text) {
                    var parts = item.text.split(", ");
                    address.line.push(parts[0]);
                    address.city = parts[1];
                    var stateAndZip = parts[2].split(" ");
                    address.state = stateAndZip[0];
                    address.zip = stateAndZip[1];
                    address.country = parts[3];
                }
                item.address = address;
                return item;
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

        function init(items, supportHome) {
            home = supportHome;
            addresses = [];
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                item.text =
                    (angular.isArray(item.line) ? item.line.join(' ') + ', ' : '')
                        + (item.city ? (item.city + ', ') : '')
                        + (item.state ? (item.state + ' ') : '')
                        + (item.zip ? (item.zip + ', ') : '')
                        + (item.country ? (item.country) : '');
                addresses.push(item);
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

        function searchGoogle(input) {
            var deferred = $q.defer();
            $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: input
                }})
                .success(function (data) {
                    var addresses = [];
                    if (data.results) {
                        angular.forEach(data.results,
                            function (item) {
                                addresses.push(item.formatted_address);
                            });
                    }
                    deferred.resolve(addresses);
                })
                .error(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function supportHome() {
            return home;
        }

    }
})();