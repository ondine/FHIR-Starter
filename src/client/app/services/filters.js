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
                retValue = linkId;
                var startIndex = linkId.indexOf('.');
                if (startIndex > 0) {
                    retValue = capitalize(linkId.substring(startIndex + 1));

                }
            }
            return retValue;

            function capitalize(input) {
                return input.replace(/^./, function(match) {
                    return match.toUpperCase();
                })
            }
        }
    });

})();