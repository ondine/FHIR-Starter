'use strict';

var FHIRStarter = angular.module('FHIRStarter', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ngCookies', 'angular-loading-bar', 'ui.bootstrap'])
    .config(function ($routeProvider, $httpProvider, $locationProvider, cfpLoadingBarProvider) {
        $routeProvider
            .when('/main', {
                templateUrl: '/templates/main.html',
                controller: 'MainController'
            })
            .when('/patient', {
                templateUrl: '/templates/patient.html',
                controller: 'PatientController'
            })
            .when('/person', {
                templateUrl: '/templates/person.html',
                controller: 'PersonController'
            })
            .when('/practitioner', {
                templateUrl: '/templates/practitioner.html',
                controller: 'PractitionerController'
            })
            .when('/organization', {
                mode: 'search',
                templateUrl: '/templates/organization.html',
                controller: 'OrganizationController'
            })
            .when('/editOrganization', {
                mode: 'add',
                templateUrl: '/templates/editOrganization.html',
                controller: 'OrganizationController'
            })
            .when('/editOrganization/:hash', {
                mode: 'edit',
                templateUrl: '/templates/editOrganization.html',
                controller: 'OrganizationController'
            })
            .otherwise({redirectTo: '/main'});
        $locationProvider.html5Mode(true);
        cfpLoadingBarProvider.includeSpinner = true;
        $httpProvider.defaults.headers.common = { 'Accept': 'application/json+fhir, application/json'};
        $httpProvider.defaults.headers.put = { 'Content-Type': 'application/json+fhir', 'X-FHIR-Starter': 'urn:fhir.starter' };
        $httpProvider.defaults.headers.post = { 'Content-Type': 'application/json+fhir', 'X-FHIR-Starter': 'urn:fhir.starter' };
        $httpProvider.defaults.headers.delete = { 'X-FHIR-Starter': 'urn:fhir.starter' };
        $httpProvider.defaults.headers.options = { 'Access-Control-Request-Headers': 'X-FHIR-Starter', 'Content-Location': 'urn:fhir.starter'};
        $httpProvider.withCredentials = false;
    })
    .factory('cacheService', function ($cacheFactory) {
        return $cacheFactory('cacheService', {capacity: 50});
    })
    .filter('truncate', function () {
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
            return resultString;
        };
    });

function generateUUID() {
    var d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
        function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
}