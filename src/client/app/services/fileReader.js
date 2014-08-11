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