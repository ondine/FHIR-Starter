(function () {
    'use strict';

    var serviceId = 'humanNameService';

    angular.module('FHIRStarter').factory(serviceId, ['common', humanNameService]);

    function humanNameService(common) {
        var humanNames = [];

        var service = {
            add: add,
            remove: remove,
            getAll: getAll,
            getFullName: getFullName,
            init: init,
            mapFromViewModel: mapFromViewModel,
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

        function getFullName() {
            var fullName = 'Unspecified Name';
            if (humanNames.length > 0) {
                fullName = humanNames[0].given + ' ' + humanNames[0].family;
            }
            return fullName;
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
                humanNames = [];
                _.forEach(items, function (item) {
                    var humanName = {};
                    if (angular.isArray(item.given)) {
                        humanName.given = item.given.join(' ');
                    }
                    if (angular.isArray(item.family)) {
                        humanName.family = item.family.join(' ');
                    }
                    if (angular.isArray(item.prefix)) {
                        humanName.prefix = item.prefix.join(' ');
                    }
                    if (angular.isArray(item.suffix)) {
                        humanName.suffix = item.suffix.join(' ');
                    }
                    humanName.text = item.text;
                    humanName.period = item.period;
                    humanName.use = item.use;
                    humanNames.push(humanName);
                });
            } else {
                humanNames = [];
            }
            return humanNames;
        }

        function mapFromViewModel() {
            var model = [];
            _.forEach(humanNames, function (item) {
                var mappedItem = {};
                if (item.given) {
                    mappedItem.given = item.given.split(' ');
                }
                if (item.family) {
                    mappedItem.family = item.family.split(' ');
                }
                if (item.prefix) {
                    mappedItem.prefix = item.prefix.split(' ');
                }
                if (item.suffix) {
                    mappedItem.suffix = item.suffix.split(' ');
                }
                mappedItem.text = item.text;
                mappedItem.period = item.period;
                mappedItem.use = item.use;
                model.push(mappedItem);
            });
            return model;
        }

        function remove(item) {
            var index = getIndex(item.$$hashKey);
            humanNames.splice(index, 1);
            return humanNames;
        }

        function reset() {
            while (humanNames.length > 0) {
                humanNames.pop();
            }
        }
    }
})();