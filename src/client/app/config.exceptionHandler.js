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
// Include in index.html so that app level exceptions are handled.
(function () {
    'use strict';

    var app = angular.module('FHIRStarter');

    // Configure by setting an optional string value for appErrorPrefix.
    // Accessible via config.appErrorPrefix (via config value).
    app.config(['$provide', function ($provide) {
        $provide.decorator('$exceptionHandler', ['$delegate', 'config', 'logger', extendExceptionHandler]);
    }]);

    // Extend the $exceptionHandler service to also display a toast.
    function extendExceptionHandler($delegate, config, logger) {
        var appErrorPrefix = config.appErrorPrefix;
        var logError = logger.getLogFn('FHIRStarter', 'error');
        return function (exception, cause) {
            $delegate(exception, cause);
            if (appErrorPrefix && exception.message.indexOf(appErrorPrefix) === 0) {
                return;
            }

            var errorData = { exception: exception, cause: cause };
            var msg = appErrorPrefix + exception.message;
            logError(msg, errorData, true);
        };
    }
})();