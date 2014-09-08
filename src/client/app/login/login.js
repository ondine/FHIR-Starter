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

    var controllerId = 'login';

    angular.module('FHIRStarter')
        .controller(controllerId, ['$http', '$window', login]);

    function login($http, $window) {
        var vm = this;

        vm.activate = activate;
        vm.isAuthenticated = false;
        vm.callRestricted = callRestricted;
        vm.logout = logout;
        vm.message = '';
        vm.submit = submit;
        vm.user = {username: 'elizabeth.corday', password: 'secret'};
        vm.welcome = 'Please login';

        activate();

        function activate() {
        }

        function submit() {
            $http
                .post('/authenticate', vm.user)
                .success(function (data, status, headers, config) {
                    var localData = { "token": null };
                    if (angular.isUndefined(data.token)) {
                        localData.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMzQ1Njc4OTAsImZpcnN0TmFtZSI6IkVsaXphYmV0aCIsImxhc3ROYW1lIjoiQ29yZGF5IiwiYWRtaW4iOnRydWV9._3MQ7EbbtcMjQ3wypes_Xy-9_iTN0tU6K1F6MZSkJAI';
                    } else {
                        localData.token = data.token;
                    }


                    $window.sessionStorage.token = localData.token;
                    vm.isAuthenticated = true;
                    var encodedProfile = localData.token.split('.')[1];
                    var profile = JSON.parse(url_base64_decode(encodedProfile));
                    vm.welcome = 'Welcome ' + profile.firstName + ' ' + profile.lastName;
                })
                .error(function (data, status, headers, config) {
                    // Erase the token if the user fails to log in
                    delete $window.sessionStorage.token;
                    vm.isAuthenticated = false;

                    // Handle login errors here
                    vm.error = 'Error: Invalid user or password';
                    vm.welcome = '';
                });
        }

        function logout() {
            vm.welcome = 'Please login';
            vm.message = '';
            vm.isAuthenticated = false;
            delete $window.sessionStorage.token;
        }

        function callRestricted () {
            $http({url: '/api/restricted', method: 'GET'})
                .success(function (data, status, headers, config) {
                    vm.message = vm.message + ' ' + data.name; // Should log 'foo'
                })
                .error(function (data, status, headers, config) {
                    //toastr.error('failed: ' + data);
                    //interceptor is handling the alert
                });
        }

        //this is used to parse the profile
        function url_base64_decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output); //polyfill https://github.com/davidchambers/Base64.js
        }
    }
})();