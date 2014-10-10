'use strict';

var fhirStarterFiles = {
    'fhirStarterSrc': [
        'client/app/app.js',
        'client/app/config.js',
        'client/app/config.exceptionHandler.js',
        'client/app/config.route.js',

        'client/app/common/common.js',
        'client/app/common/logger.js',
        'client/app/common/spinner.js',

        'client/app/common/bootstrap/bootstrap.dialog.js',

        'client/app/layout/shell.js',
        'client/app/layout/sidebar.js',
        'client/app/layout/topnav.js',

        'client/app/services/dataCache.js',
        'client/app/services/directives.js',
        'client/app/services/fhirClient.js',
        'client/app/services/fhirServers.js',
        'client/app/services/filters.js',
        'client/app/services/localValueSets.js',
        'client/app/services/fileReader.js',

        'client/app/dashboard/dashboard.js',
        'client/app/dashboard/conformanceService.js',

        'client/app/login/login.js',

        'client/app/shared/identifier/identifier.js',
        'client/app/shared/identifier/identifierService.js',
        'client/app/shared/address/address.js',
        'client/app/shared/address/addressService.js',
        'client/app/shared/contact/contact.js',
        'client/app/shared/contact/contactService.js',
        'client/app/shared/telecom/telecom.js',
        'client/app/shared/telecom/telecomService.js',
        'client/app/shared/demographics/demographics.js',
        'client/app/shared/demographics/demographicsService.js',
        'client/app/shared/humanName/humanName.js',
        'client/app/shared/humanName/humanNameService.js',
        'client/app/shared/attachment/attachment.js',
        'client/app/shared/attachment/attachmentService.js',
        'client/app/shared/qualification/qualification.js',
        'client/app/shared/qualification/qualificationService.js',
        'client/app/shared/questionnaireAnswer/questionnaireAnswer.js',
        'client/app/shared/questionnaireAnswer/questionnaireAnswerService.js',
        'client/app/shared/questionnaireAnswer/questionnaireAnswerDirectives.js',

        'client/app/administration/organization/organizations.js',
        'client/app/administration/organization/organizationDetail.js',
        'client/app/administration/organization/organizationService.js',
        'client/app/administration/patient/patients.js',
        'client/app/administration/patient/patientDetail.js',
        'client/app/administration/patient/patientService.js',
        'client/app/administration/person/persons.js',
        'client/app/administration/person/personDetail.js',
        'client/app/administration/person/personService.js',
        'client/app/administration/practitioner/practitioners.js',
        'client/app/administration/practitioner/practitionerDetail.js',
        'client/app/administration/practitioner/practitionerService.js',
        'client/app/administration/location/locations.js',
        'client/app/administration/location/locationDetail.js',
        'client/app/administration/location/locationService.js',

        'client/app/clinical/questionnaire/questionnaires.js',
        'client/app/clinical/questionnaire/questionnaireDetail.js',
        'client/app/clinical/questionnaire/questionnaireService.js',

        'client/app/infrastructure/valueset/valuesets.js',
        'client/app/infrastructure/valueset/valuesetDetail.js',
        'client/app/infrastructure/valueset/valuesetService.js',
        'client/app/infrastructure/conceptmap/conceptmaps.js',
        'client/app/infrastructure/conceptmap/conceptmapDetail.js',
        'client/app/infrastructure/conceptmap/conceptmapService.js',
        'client/app/infrastructure/profile/profiles.js',
        'client/app/infrastructure/profile/profileDetail.js',
        'client/app/infrastructure/profile/profileService.js',
        'client/app/infrastructure/profile/profileQuestionnaire.js',

        'client/app/infrastructure/composition/compositions.js',
        'client/app/infrastructure/composition/compositionDetail.js',
        'client/app/infrastructure/composition/compositionService.js',
    ],

    'fhirStarterLoader': [
        'client/app/minErr.js',
        'client/app/loader.js'
    ],

    'fhirStarterModules': {
        'ngAnimate': [
            'client/app/ngAnimate/animate.js'
        ],
        'ngCookies': [
            'client/app/ngCookies/cookies.js'
        ],
        'ngMessages': [
            'client/app/ngMessages/messages.js'
        ],
        'ngResource': [
            'client/app/ngResource/resource.js'
        ],
        'ngRoute': [
            'client/app/ngRoute/route.js',
            'client/app/ngRoute/routeParams.js',
            'client/app/ngRoute/directive/ngView.js'
        ],
        'ngSanitize': [
            'client/app/ngSanitize/sanitize.js',
            'client/app/ngSanitize/filter/linky.js'
        ],
        'ngMock': [
            'client/app/ngMock/fhirStarter-mocks.js'
        ],
        'ngTouch': [
            'client/app/ngTouch/touch.js',
            'client/app/ngTouch/swipe.js',
            'client/app/ngTouch/directive/ngClick.js',
            'client/app/ngTouch/directive/ngSwipe.js'
        ],
        'ngAria': [
            'client/app/ngAria/aria.js'
        ]
    },

    'fhirStarterScenario': [
        'client/app/ngScenario/Scenario.js',
        'client/app/ngScenario/browserTrigger.js',
        'client/app/ngScenario/Application.js',
        'client/app/ngScenario/Describe.js',
        'client/app/ngScenario/Future.js',
        'client/app/ngScenario/ObjectModel.js',
        'client/app/ngScenario/Runner.js',
        'client/app/ngScenario/SpecRunner.js',
        'client/app/ngScenario/dsl.js',
        'client/app/ngScenario/matchers.js',
        'client/app/ngScenario/output/Html.js',
        'client/app/ngScenario/output/Json.js',
        'client/app/ngScenario/output/Xml.js',
        'client/app/ngScenario/output/Object.js'
    ],

    'fhirStarterTest': [
        'test/helpers/*.js',
        'test/ngScenario/*.js',
        'test/ngScenario/output/*.js',
        'test/*.js',
        'test/auto/*.js',
        'test/ng/**/*.js',
        'test/ngAnimate/*.js',
        'test/ngMessages/*.js',
        'test/ngCookies/*.js',
        'test/ngResource/*.js',
        'test/ngRoute/**/*.js',
        'test/ngSanitize/**/*.js',
        'test/ngMock/*.js',
        'test/ngTouch/**/*.js',
        'test/ngAria/*.js'
    ],

    'karma': [
        'bower_components/jquery/dist/jquery.js',
        'test/jquery_remove.js',
        '@fhirStarterSrc',
        'client/app/publishExternalApis.js',
        '@fhirStarterSrcModules',
        '@fhirStarterScenario',
        '@fhirStarterTest',
    ],

    'karmaExclude': [
        'test/jquery_alias.js',
        'client/app/fhirStarter-bootstrap.js',
        'client/app/ngScenario/fhirStarter-bootstrap.js'
    ],

    'karmaScenario': [
        'build/fhirStarter-scenario.js',
        'build/docs/docs-scenario.js'
    ],

    "karmaModules": [
        'build/fhirStarter.js',
        '@fhirStarterSrcModules',
        'client/app/ngScenario/browserTrigger.js',
        'test/helpers/*.js',
        'test/ngMock/*.js',
        'test/ngCookies/*.js',
        'test/ngRoute/**/*.js',
        'test/ngResource/*.js',
        'test/ngSanitize/**/*.js',
        'test/ngTouch/**/*.js',
        'test/ngAria/*.js'
    ],

    'karmaJquery': [
        'bower_components/jquery/dist/jquery.js',
        'test/jquery_alias.js',
        '@fhirStarterSrc',
        'client/app/publishExternalApis.js',
        '@fhirStarterSrcModules',
        '@fhirStarterScenario',
        '@fhirStarterTest',
    ],

    'karmaJqueryExclude': [
        'client/app/fhirStarter-bootstrap.js',
        'client/app/ngScenario/fhirStarter-bootstrap.js',
        'test/jquery_remove.js'
    ]
};

fhirStarterFiles['fhirStarterSrcModules'] = [].concat(
    fhirStarterFiles['fhirStarterModules']['ngAnimate'],
    fhirStarterFiles['fhirStarterModules']['ngMessages'],
    fhirStarterFiles['fhirStarterModules']['ngCookies'],
    fhirStarterFiles['fhirStarterModules']['ngResource'],
    fhirStarterFiles['fhirStarterModules']['ngRoute'],
    fhirStarterFiles['fhirStarterModules']['ngSanitize'],
    fhirStarterFiles['fhirStarterModules']['ngMock'],
    fhirStarterFiles['fhirStarterModules']['ngTouch'],
    fhirStarterFiles['fhirStarterModules']['ngAria']
);

if (exports) {
    exports.files = fhirStarterFiles;
    exports.mergeFilesFor = function() {
        var files = [];

        Array.prototype.slice.call(arguments, 0).forEach(function(filegroup) {
            fhirStarterFiles[filegroup].forEach(function(file) {
                // replace @ref
                var match = file.match(/^\@(.*)/);
                if (match) {
                    files = files.concat(fhirStarterFiles[match[1]]);
                } else {
                    files.push(file);
                }
            });
        });

        return files;
    };
}
