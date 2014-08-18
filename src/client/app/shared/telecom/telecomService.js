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
            mapFromViewModel: mapFromViewModel,
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
                telecoms = mapToViewModel(items);
            } else {
                telecoms = [];
            }

            function mapToViewModel(items) {
                var modelView = [];
                var workFiltered = _.filter(items, { "use": "work"});
                var homeFiltered = _.filter(items, { "use": "home"});
                var tempFiltered = _.filter(items, { "use": "temp"});
                var oldFiltered = _.filter(items, { "use": "old"});  // TODO: add period filter
                var mobileFiltered = _.filter(items, { "use": "mobile"});
                var noUseFiltered = _.filter(items, { "use": undefined});

                // use first found item
                buildTelecom(workFiltered, "work");
                buildTelecom(homeFiltered, "home");
                buildTelecom(tempFiltered, "temp");
                buildTelecom(oldFiltered, "old");
                buildTelecom(mobileFiltered, "mobile");
                buildTelecom(noUseFiltered, undefined);

                return modelView;

                function buildTelecom(filteredArray, useName) {
                    var telecom;
                    if (filteredArray && filteredArray.length > 0) {
                        telecom = { "use": useName };
                        var phone = _.find(filteredArray, { "system": "phone"});
                        if (phone) {
                            telecom.phone = phone.value;
                        }
                        var fax = _.find(filteredArray, { "system": "fax"});
                        if (fax) {
                            telecom.fax = fax.value;
                        }
                        var email = _.find(filteredArray, { "system": "email"});
                        if (email) {
                            telecom.email = email.value;
                        }
                        var url = _.find(filteredArray, { "system": "url"});
                        if (url) {
                            telecom.url = url.value;
                        }
                    }
                    if (telecom) {
                        modelView.push(telecom);
                    }
                }
            }
        }

        function mapFromViewModel() {
            var mappedTelecoms;
            if (telecoms) {
                mappedTelecoms = [];
                for (var i = 0, len = telecoms.length; i < len; i++) {
                    var mappedItems = mapItem(telecoms[i]);
                    for (var j = 0, len2 = mappedItems.length; j < len2; j++) {
                        mappedTelecoms.push(mappedItems[j]);
                    }
                }
            }
            return mappedTelecoms;

            function mapItem(item) {
                var mappedItems = [];
                var mappedItem = {};
                if (item) {
                    if (item.phone) {
                        mappedItem = {"system": "phone", "value": item.phone};
                        if (item.use) {
                            mappedItem.use = item.use;
                        }
                        mappedItems.push(mappedItem);
                    }
                    if (item.fax) {
                        mappedItem = {"system": "fax", "value": item.fax};
                        if (item.use) {
                            mappedItem.use = item.use;
                        }
                        mappedItems.push(mappedItem);
                    }
                    if (item.email) {
                        mappedItem = {"system": "email", "value": item.email};
                        if (item.use) {
                            mappedItem.use = item.use;
                        }
                        mappedItems.push(mappedItem);
                    }
                    if (item.email) {
                        mappedItem = {"system": "url", "value": item.url};
                        if (item.use) {
                            mappedItem.use = item.use;
                        }
                        mappedItems.push(mappedItem);
                    }
                }
                return mappedItems;
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