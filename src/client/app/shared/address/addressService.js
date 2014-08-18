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
        var _mode = 'multi';

        var service = {
            add: add,
            remove: remove,
            getAll: getAll,
            getMode: getMode,
            init: init,
            mapFromViewModel: mapFromViewModel,
            reset: reset,
            searchGoogle: searchGoogle,
            setSingle: setSingle,
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
            return _.compact(addresses);
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

        function getMode() {
            return _mode;
        }

        function init(items, supportHome, mode) {
            _mode = mode ? mode : 'multi';
            home = supportHome;
            addresses = [];
            if (items && angular.isArray(items)) {
                for (var i = 0, len = items.length; i < len; i++) {
                    var item = { "address": items[i] };
                    if (angular.isObject(item.address)) {
                        item.use = item.address.use;
                        item.text =
                            (angular.isArray(item.address.line) ? item.address.line.join(' ') + ', ' : '')
                                + (item.address.city ? (item.address.city + ', ') : '')
                                + (item.address.state ? (item.address.state + ' ') : '')
                                + (item.address.zip ? (item.address.zip + ', ') : '')
                                + (item.address.country ? (item.address.country) : '');
                        addresses.push(item);
                    }
                }
            }
        }

        function mapFromViewModel() {
            var mappedAddresses;
            if (addresses) {
                mappedAddresses = [];
                for (var i = 0, len = addresses.length; i < len; i++) {
                    var mappedItem = mapItem(addresses[i]);
                    mappedAddresses.push(mappedItem);
                }
            }
            return mappedAddresses;

            function mapItem(item) {
                var mappedItem = { "line": [] };
                if (item) {
                    if (item.use) {
                        mappedItem.use = item.use;
                    }
                    if (item.text) {
                        mappedItem.text = item.text;
                    }
                    if (item.address) {
                        mappedItem.line = item.address.line;
                        mappedItem.city = item.address.city;
                        mappedItem.state = item.address.state;
                        mappedItem.zip = item.address.zip;
                        mappedItem.country = item.address.country;
                    }
                }
                return mappedItem;
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

        function setSingle(item) {
            reset();
            add(item);
        }

        function supportHome() {
            return home;
        }

    }
})();