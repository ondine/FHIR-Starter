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
    
    angular.module('common')
        .factory('logger', ['$log', logger]);

    function logger($log) {
        var service = {
            getLogFn: getLogFn,
            log: log,
            logError: logError,
            logSuccess: logSuccess,
            logWarning: logWarning
        };

        return service;

        function getLogFn(moduleId, fnName) {
            fnName = fnName || 'log';
            switch (fnName.toLowerCase()) { // convert aliases
                case 'success':
                    fnName = 'logSuccess'; break;
                case 'error':
                    fnName = 'logError'; break;
                case 'warn':
                    fnName = 'logWarning'; break;
                case 'warning':
                    fnName = 'logWarning'; break;
            }

            var logFn = service[fnName] || service.log;
            return function (msg, data, showToast) {
                logFn(msg, data, moduleId, (showToast === undefined) ? true : showToast);
            };
        }

        function log(message, data, source, showToast) {
            logIt(message, data, source, showToast, 'info');
        }

        function logWarning(message, data, source, showToast) {
            logIt(message, data, source, showToast, 'warning');
        }

        function logSuccess(message, data, source, showToast) {
            logIt(message, data, source, showToast, 'success');
        }

        function logError(message, data, source, showToast) {
            logIt(message, data, source, showToast, 'error');
        }

        function logIt(message, data, source, showToast, toastType) {
            var write = (toastType === 'error') ? $log.error : $log.log;
            source = source ? '[' + source + '] ' : '';
            write(source, message, data);
            if (showToast) {
                if (toastType === 'error') {
                    toastr.error(message);
                } else if (toastType === 'warning') {
                    toastr.warning(message);
                } else if (toastType === 'success') {
                    toastr.success(message);
                } else {
                    toastr.info(message);
                }
            }
        }
    }
})();