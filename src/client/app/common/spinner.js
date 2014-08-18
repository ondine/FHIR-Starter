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

    // Must configure the common service and set its 
    // events via the commonConfigProvider

    angular.module('common')
        .factory('spinner', ['common', 'commonConfig', spinner]);

    function spinner(common, commonConfig) {
        var service = {
            spinnerHide: spinnerHide,
            spinnerShow: spinnerShow
        };

        return service;

        function spinnerHide() {
            spinnerToggle(false);
        }

        function spinnerShow() {
            spinnerToggle(true);
        }

        function spinnerToggle(show) {
            common.$broadcast(commonConfig.config.spinnerToggleEvent, { show: show });
        }
    }
})();