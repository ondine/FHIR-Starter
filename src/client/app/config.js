(function () {
    'use strict';

    var app = angular.module('FHIRStarter');

    // Configure Toastr
    toastr.options.timeOut = 3000;
    toastr.options.positionClass = 'toast-bottom-right';

    var keyCodes = {
        backspace: 8,
        tab: 9,
        enter: 13,
        esc: 27,
        space: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        insert: 45,
        del: 46
    };

     var events = {
        controllerActivateSuccess: 'controller.activateSuccess',
        spinnerToggle: 'spinner.toggle'
    };

    var config = {
        appErrorPrefix: '[FS Error] ', //Configure the exceptionHandler decorator
        docTitle: 'FHIRStarter: ',
        events: events,
        keyCodes: keyCodes,
        version: '0.1.0'
    };

    app.value('config', config);
    
    app.config(['$logProvider', function ($logProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }

    }]);

    app.config(['$locationProvider', function($locationProvider) {
        $locationProvider.html5Mode(true);
    }]);

    app.config(['$httpProvider', function($httpProvider) {
        // app-specific header X-FHIR-Starter for CORS
        $httpProvider.defaults.headers.common = { 'Accept': 'application/json+fhir, application/json, text/plain, */*'};
        $httpProvider.defaults.headers.put = { 'Content-Type': 'application/json+fhir', 'X-FHIR-Starter': 'urn:fhir.starter' };
        $httpProvider.defaults.headers.post = { 'Content-Type': 'application/json+fhir', 'X-FHIR-Starter': 'urn:fhir.starter' };
        $httpProvider.defaults.headers.delete = { 'X-FHIR-Starter': 'urn:fhir.starter' };
        $httpProvider.defaults.headers.options = { 'Access-Control-Request-Headers': 'X-FHIR-Starter', 'Content-Location': 'urn:fhir.starter'};
    }]);
    
    app.config(['commonConfigProvider', function (cfg) {
        cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
        cfg.config.spinnerToggleEvent = config.events.spinnerToggle;
    }]);
})();