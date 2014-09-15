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

    // Collect the routes
    app.constant('routes', getRoutes());

    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {

        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }

    // Define the routes
    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'app/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 0,
                        content: '<i class="fa fa-database"></i> Dashboard'
                    }
                }
            },
            {
                url: '/login',
                config: {
                    templateUrl: 'app/login/login.html',
                    title: 'login',
                    settings: {
                        nav: 4,
                        content: '<i class="fa fa-openid"></i> Login'
                    }
                }
            },
            /*           {
             url: '/locations',
             config: {
             title: 'locations',
             templateUrl: '/app/administration/location/locations.html',
             settings: {
             nav: 1,
             content: '<i class="fa fa-building"></i> Location'
             }
             }
             },
             {
             url: '/location/edit/:hashKey',
             config: {
             title: 'location',
             templateUrl: '/app/administration/location/locationEdit.html',
             settings: { }
             }
             },
             {
             url: '/location/view/:hashKey',
             config: {
             title: 'location',
             templateUrl: '/app/administration/location/locationDetail.html',
             settings: { }
             }
             },
             {
             url: '/organizations',
             config: {
             title: 'organizations',
             templateUrl: '/app/administration/organization/organizations.html',
             settings: {
             nav: 2,
             content: '<i class="fa fa-hospital-o"></i> Organization'
             }
             }
             },
             {
             url: '/organization/edit/:hashKey',
             config: {
             title: 'organization',
             templateUrl: '/app/administration/organization/organizationEdit.html',
             settings: { }
             }
             },
             {
             url: '/organization/view/:hashKey',
             config: {
             title: 'organization',
             templateUrl: '/app/administration/organization/organizationDetail.html',
             settings: { }
             }
             },
             {
             url: '/practitioners',
             config: {
             title: 'practitioners',
             templateUrl: '/app/administration/practitioner/practitioners.html',
             settings: {
             nav: 5,
             content: '<i class="fa fa-user-md"></i> Practitioner'
             }
             }
             },
             {
             url: '/practitioner/:hashKey',
             config: {
             title: 'practitioner',
             templateUrl: '/app/administration/practitioner/practitionerEdit.html',
             settings: { }
             }
             },
             {
             url: '/practitioner/view/:hashKey',
             config: {
             title: 'practitioner',
             templateUrl: '/app/administration/practitioner/practitionerDetail.html',
             settings: { }
             }
             },*/
            {
                url: '/patients',
                config: {
                    title: 'patients',
                    templateUrl: '/app/administration/patient/patients.html',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-wheelchair"></i> Patient'
                    }
                }
            },
            {
                url: '/patient/:hashKey',
                config: {
                    title: 'patient',
                    templateUrl: '/app/administration/patient/patientEdit.html',
                    settings: { }
                }
            },
            {
                url: '/patient/view/:hashKey',
                config: {
                    title: 'patient',
                    templateUrl: '/app/administration/patient/patientDetail.html',
                    settings: { }
                }
            },
            /*           {
             url: '/persons',
             config: {
             title: 'person',
             templateUrl: '/app/administration/person/persons.html',
             settings: {
             nav: 4,
             content: '<i class="fa fa-user"></i> Related Person'
             }
             }
             },
             {
             url: '/person/:hashKey',
             config: {
             title: 'person',
             templateUrl: '/app/administration/person/personEdit.html',
             settings: { }
             }
             },
             {
             url: '/person/view/:hashKey',
             config: {
             title: 'person',
             templateUrl: '/app/administration/person/personDetail.html',
             settings: { }
             }
             },
             {
             url: '/questionnaires',
             config: {
             title: 'questionnaire',
             templateUrl: '/app/clinical/questionnaire/questionnaires.html',
             settings: {
             nav: 5,
             content: '<i class="fa fa-clipboard"></i> Questionnaire'
             }
             }
             },
             {
             url: '/questionnaire/:hashKey',
             config: {
             title: 'questionnaire',
             templateUrl: '/app/clinical/questionnaire/questionnaireDetail.html',
             settings: { }
             }
             },
             {
             url: '/questionnaire/Practitioner/:id',
             config: {
             title: 'questionnaire-practitioner',
             templateUrl: '/app/administration/practitioner/practitionerDetail.html',
             settings: { }
             }
             },
             {
             url: '/questionnaire/Patient/:id',
             config: {
             title: 'questionnaire-patient',
             templateUrl: '/app/administration/patient/patientDetail.html',
             settings: { }
             }
             },
             {
             url: '/valuesets',
             config: {
             title: 'valuesets',
             templateUrl: '/app/infrastructure/valueset/valuesets.html',
             settings: {
             nav: 6,
             content: '<i class="fa fa-codepen"></i> ValueSet'
             }
             }
             },
             {
             url: '/valueset/:hashKey',
             config: {
             title: 'valueset',
             templateUrl: '/app/infrastructure/valueset/valuesetDetail.html',
             settings: { }
             }
             },
             {
             url: '/conceptmaps',
             config: {
             title: 'conceptmaps',
             templateUrl: '/app/infrastructure/conceptmap/conceptmaps.html',
             settings: {
             nav: 7,
             content: '<i class="fa fa-map-marker"></i> ConceptMap'
             }
             }
             },
             {
             url: '/conceptmap/:hashKey',
             config: {
             title: 'conceptmap',
             templateUrl: '/app/infrastructure/conceptmap/conceptmapDetail.html',
             settings: { }
             }
             },*/
            {
                url: '/profiles',
                config: {
                    title: 'profiles',
                    templateUrl: '/app/infrastructure/profile/profiles.html',
                    settings: {
                        nav: 8,
                        content: '<i class="fa fa-file-text-o"></i> Profile'
                    }
                }
            },
            {
                url: '/profile/:hashKey',
                config: {
                    title: 'profile',
                    templateUrl: '/app/infrastructure/profile/profileDetail.html',
                    settings: { }
                }
            },
            {
                url: '/profile/questionnaire/:hashKey',
                config: {
                    title: 'profile-questionnaire',
                    templateUrl: '/app/infrastructure/profile/profileQuestionnaire.html',
                    settings: { }
                }
            },
            /*          {
             url: '/compositions',
             config: {
             title: 'compositions',
             templateUrl: '/app/infrastructure/composition/compositions.html',
             settings: {
             nav: 9,
             content: '<i class="fa fa-paperclip"></i> Composition'
             }
             }
             },
             {
             url: '/composition/:hashKey',
             config: {
             title: 'composition',
             templateUrl: '/app/infrastructure/composition/compositionDetail.html',
             settings: { }
             }
             },*/
        ];
    }
})();