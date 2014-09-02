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

    // Configure Toastr
    toastr.options.timeOut = 3000;
    toastr.options.positionClass = 'toast-bottom-right';

    var imageSettings = {
        imageBasePath: '/content/images/',
        unknownPersonImageSource: '/content/images/unknown_person.jpg'
    }

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

    var fhirTypes = {
        Primitive: 1,
        Complex: 2,
        Resource: 3
    }

    var fhirPrimitiveTypes = {
        base64Binary: "base64Binary",
        boolean: "boolean",
        code: "code",
        date: "date",
        dateTime: "dateTime",
        decimal: "decimal",
        id: "id",
        instant: "instant",
        integer: "integer",
        oid: "oid",
        string: "string",
        time: "time",
        uri: "uri",
        uuid: "uuid"
    }

    var fhirResources = {
        AdverseReaction: "AdverseReaction",
        Alert: "Alert",
        AllergyIntolerance: "AllergyIntolerance",
        Appointment: "Appointment",
        AppointmentResponse: "AppointmentResponse",
        Availability: "Availability",
        Binary: "Binary",
        CarePlan: "CarePlan",
        Composition: "Composition",
        ConceptMap: "ConceptMap",
        Condition: "Condition",
        Contraindication: "Contraindication",
        Conformance: "Conformance",
        DataElement: "DataElement",
        Device: "Device",
        DeviceObservationReport: "DeviceObservationReport",
        DiagnosticOrder: "DiagnosticOrder",
        DiagnosticReport: "DiagnosticReport",
        DocumentReference: "DocumentReference",
        DocumentManifest: "DocumentManifest",
        Encounter: "Encounter",
        FamilyHistory: "FamilyHistory",
        Group: "Group",
        ImagingStudy: "ImagingStudy",
        Immunization: "Immunization",
        ImmunizationRecommendation: "ImmunizationRecommendation",
        List: "List",
        Location: "Location",
        Media: "Media",
        Medication: "Medication",
        MedicationAdministration: "MedicationAdministration",
        MedicationDispense: "MedicationDispense",
        MedicationPrescription: "MedicationPrescription",
        MedicationStatement: "MedicationStatement",
        MessageHeader: "MessageHeader",
        Namespace: "Namespace",
        Observation: "Observation",
        OperationOutcome: "OperationOutcome",
        Order: "Order",
        OrderResponse: "OrderResponse",
        Organization: "Organization",
        Other: "Other",
        Patient: "Patient",
        Practitioner: "Practitioner",
        Procedure: "Procedure",
        Profile: "Profile",
        Provenance: "Provenance",
        Query: "Query",
        Questionnaire: "Questionnaire",
        QuestionnaireAnswers: "QuestionnaireAnswers",
        ReferralRequest: "ReferralRequest",
        RelatedPerson: "RelatedPerson",
        RiskAssessment: "RiskAssessment",
        SecurityEvent: "SecurityEvent",
        Slot: "Slot",
        Specimen: "Specimen",
        Subscription: "Subscription",
        Substance: "Substance",
        Supply: "Supply",
        ValueSet: "ValueSet"
    }

    var fhirComplexTypes = {
        Address: "Address",
        Age: "Age",
        Attachment: "Attachment",
        CodeableConcept: "CodeableConcept",
        Coding: "Coding",
        Contact: "Contact",
        Count: "Count",
        Distance: "Distance",
        Duration: "Duration",
        HumanName: "HumanName",
        Identifier: "Identifier",
        Money: "Money",
        Period: "Period",
        Quantity: "Quantity",
        Range: "Range",
        Ratio: "Ratio",
        SampledData: "SampledData",
        Schedule: "Schedule"
    }

    var events = {
        controllerActivateSuccess: 'controller.activateSuccess',
        spinnerToggle: 'spinner.toggle'
    };

    var config = {
        appErrorPrefix: '[FS Error] ', //Configure the exceptionHandler decorator
        docTitle: 'FHIRStarter: ',
        events: events,
        fhirPrimitiveTypes: fhirPrimitiveTypes,
        fhirResources: fhirResources,
        fhirComplexTypes: fhirComplexTypes,
        fhirTypes: fhirTypes,
        imageSettings: imageSettings,
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

    app.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode(true);
    }]);

    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.headers.common = { 'Accept': 'application/json+fhir, application/json, text/plain, */*'};
        $httpProvider.defaults.headers.put = { 'Content-Type': 'application/json+fhir' };
        $httpProvider.defaults.headers.post = { 'Content-Type': 'application/json+fhir' };
    }]);

    app.config(['commonConfigProvider', function (cfg) {
        cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
        cfg.config.spinnerToggleEvent = config.events.spinnerToggle;
    }]);

    app.config(['$compileProvider', function ($compileProvider) {
        //  Default imgSrcSanitizationWhitelist: /^\s*(https?|ftp|file):|data:image\//
        //  chrome-extension: will be added to the end of the expression
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|chrome-extension):|data:image\//);
    }]);
})();