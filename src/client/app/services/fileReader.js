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

    var serviceId = 'fileReader';

    angular.module('FHIRStarter').factory(serviceId, ['common', fileReader]);

    function fileReader(common) {
        var $q = common.$q;

        var service = {
            readAsDataUrl: readAsDataUrl
        };

        return service;

        function readAsDataUrl (file, scope) {
            var deferred = $q.defer();

            var reader = _getReader(deferred, scope);
            reader.readAsDataURL(file);

            return deferred.promise;
        }

        function _getReader (deferred, scope) {
            var reader = new FileReader();
            reader.onload = _onLoad(reader, deferred, scope);
            reader.onerror = _onError(reader, deferred, scope);
            reader.onprogress = _onProgress(reader, scope);
            return reader;
        }

        function _onError (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        }

        function _onLoad (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        }

        function _onProgress (reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        }
    }
})();