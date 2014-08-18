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

    var app = angular.module('FHIRStarter');

    app.filter('truncate', function () {
        return function (input, len) {
            if (typeof input === 'undefined' || input === null || input === '') {
                return '';
            }
            if (isNaN(len) || (len <= 0)) {
                len = 20;
            }
            input = input.replace(/\r?\n|\r/gm, ' ').replace(/<[^>]*>/gi, ' ').split(' ');
            var resultString = '';

            while (input.length > 0) {
                resultString += input.splice(0, len).join(' ');
                if (resultString.length >= len) {
                    break;
                }
            }

            if (resultString.length > len && resultString.indexOf(' ')) {
                resultString = (resultString.substring(0, len)) + ' ...';
            }
            return resultString;
        };
    });

    app.filter('fullName', function () {
        return function (humanName) {
            if (humanName && angular.isArray(humanName)) {
                return buildName(humanName[0].given) + ' ' + buildName(humanName[0].family);
            } else if (humanName && humanName.given) {
                return buildName(humanName.given) + ' ' + buildName(humanName.family);
            }
            else {
                return 'Name Unknown';
            }

            function buildName(input) {
                if (input && angular.isArray(input)) {
                    return input.join(' ');
                } else {
                    return '';
                }
            }
        }
    });

    app.filter('questionnaireLabel', function () {
        return function (linkId) {
            var retValue = 'Unspecified';
            if (linkId) {
                retValue = spaceWords(linkId);
                var startIndex = retValue.lastIndexOf('.');
                if (startIndex > 0) {
                    retValue = capitalizeFirstWord(retValue.substring(startIndex + 1));
                }
            }
            return retValue;

            function capitalizeFirstWord(input) {
                return input.replace(/^./, function (match) {
                    return match.toUpperCase();
                })
            }

            function spaceWords(input) {
                return input.replace(/([a-z])([A-Z])/g, '$1 $2');
            }
        }
    });

    app.filter('singleLineAddress', function () {
        return function (address) {
            if (address) {
                return (address.line ? address.line.join(' ') + ', ' : '')
                    + (address.city ? address.city + ', ' : '')
                    + (address.state ? address.state : '')
                    + (address.zip ? ' ' + address.zip : '')
                    + (address.country ? ', ' + address.country : '');
            } else {
                return '';
            }
        }
    });


})();