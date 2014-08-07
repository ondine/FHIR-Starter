(function () {
    'use strict';

    var serviceId = 'contactService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'localValueSets', contactService]);

    function contactService(common, localValueSets) {
        var contacts = [];
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);


        var service = {
            add: add,
            remove: remove,
            getAll: getAll,
            init: init,
            mapFromViewModel: mapFromViewModel,
            reset: reset
        }

        return service;

        function add(item) {
            if (item) {
                var index = getIndex(item.$$hashKey);
                if (index > -1) {
                    contacts[index] = item;
                } else {
                    contacts.push(item);
                }
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

        function mapFromViewModel() {
            var mappedContacts;
            if (contacts) {
                mappedContacts = [];
                for (var i = 0, len = contacts.length; i < len; i++) {
                    var mappedItem = mapItem(contacts[i]);
                    mappedContacts.push(mappedItem);
                }
            }
            return mappedContacts;

            function mapItem(item) {
                var mappedItem = { "telecom": [], "purpose": {} };
                if (item) {
                    if (item.name) {
                        mappedItem.name = common.makeHumanName(item.name);
                    }
                    if (item.email) {
                        var email = { "value": item.email, "use": "work", "system": "email" };
                        mappedItem.telecom.push(email);
                    }
                    if (item.phone) {
                        var phone = { "value": item.phone, "use": "work", "system": "phone" };
                        mappedItem.telecom.push(email);
                    }
                    if (item.purpose) {
                        var coding = common.mapDisplayToCoding(item.purpose, localValueSets.contactEntityType());
                        if (coding) {
                            mappedItem.purpose.coding = [];
                            mappedItem.purpose.coding.push(coding);
                        }
                    }
                }
                return mappedItem;
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