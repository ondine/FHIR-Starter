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

    var serviceId = 'attachmentService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'fileReader', attachmentService]);

    function attachmentService(common, fileReader) {
        var attachments = [];
        var title = '';
        var $q = common.$q;


        var service = {
            add: add,
            remove: remove,
            getAll: getAll,
            getTitle: getTitle,
            init: init,
            reset: reset
        }

        return service;

        function add(file, scope) {
            var deferred = $q.defer();
            if (file) {
                //TODO - add content type and file size validation
                var attachment = { "contentType": file.type };
                attachment.size = file.size;
                fileReader.readAsDataUrl(file, scope)
                    .then(function (result) {
                        attachment.url = result;
                        attachments.push(attachment);
                        deferred.resolve(attachments);
                    }, function(error) {
                        deferred.reject(error);
                    });
            } else {
                deferred.reject("File not selected.")
            }
            return deferred.promise;
        }

        function getAll() {
            return attachments;
        }

        function getTitle() {
            return title;
        }

        function getIndex(hashKey) {
            if (angular.isUndefined(hashKey) === false) {
                for (var i = 0, len = attachments.length; i < len; i++) {
                    if (attachments[i].$$hashKey === hashKey) {
                        return i;
                    }
                }
            }
            return -1;
        }

        function init(items, instanceTitle) {
            title = instanceTitle;
            if (angular.isArray(items)) {
                attachments = items;
            } else {
                attachments = [];
            }
        }

        function remove(item) {
            var index = getIndex(item.$$hashKey);
            attachments.splice(index, 1);
            return attachments;
        }

        function reset() {
            while (attachments.length > 0) {
                attachments.pop();
            }
        }
    }
})();