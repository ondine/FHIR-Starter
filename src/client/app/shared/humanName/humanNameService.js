/**
 * Copyright 2014 Peter Bernhardt, et. al.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
(function () {
    'use strict';

    var serviceId = 'humanNameService';

    angular.module('FHIRStarter').factory(serviceId, ['common', humanNameService]);

    function humanNameService(common) {
        var humanNames = [];
        var _mode = 'multi';

        var service = {
            add: add,
            remove: remove,
            getAll: getAll,
            getFullName: getFullName,
            getMode: getMode,
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

        function getMode() {
            return _mode;
        }

        function init(items, mode) {
            _mode = mode ? mode : 'multi';
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