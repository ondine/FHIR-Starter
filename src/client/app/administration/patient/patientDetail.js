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

    var controllerId = 'patientDetail';

    angular.module('FHIRStarter').controller(controllerId,
        ['$location', '$routeParams', '$scope', '$window', 'addressService', 'attachmentService', 'bootstrap.dialog',
            'common', 'demographicsService', 'fhirServers', 'humanNameService', 'identifierService',
            'organizationService', 'patientService', 'questionnaireAnswerService', 'telecomService', patientDetail]);

    function patientDetail($location, $routeParams, $scope, $window, addressService, attachmentService, bsDialog,
                           common, demographicsService, fhirServers, humanNameService, identifierService,
                           organizationService, patientService, questionnaireAnswerService, telecomService) {
        /*jshint validthis:true */
        var vm;
        vm = this;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var logWarning = common.logger.getLogFn(controllerId, 'warning');
        var $q = common.$q;

        vm.activeServer = null;
        vm.calculateAge = calculateAge;
        vm.cancel = cancel;
        vm.clearErrors = clearErrors;
        vm.activate = activate;
        vm.delete = deletePatient;
        vm.dataEvents = [];
        vm.errors = [];
        vm.edit = edit;
        vm.getOrganizationReference = getOrganizationReference;
        vm.getTitle = getTitle;
        vm.goBack = goBack;
        vm.history = {"allergy": {"list": []}, "medication": {"list": []}, "condition": {"list": []}};
        vm.vitals = {"allergy": [], "medication": [], "condition": []};
        vm.lookupKey = undefined;
        vm.isBusy = false;
        vm.isSaving = false;
        vm.isEditing = true;
        vm.loadErrors = loadErrors;
        vm.loadingOrganizations = false;
        vm.patient = undefined;
        vm.save = save;
        vm.title = 'patientDetail';

        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });

        Object.defineProperty(vm, 'canDelete', {
            get: canDelete
        });

        activate();

        function activate() {
            common.activateController([getActiveServer()], controllerId).then(function () {
                getRequestedPatient();
                initStoredVitals();
            });
        }

        function calculateAge(birthDate) {
            if (birthDate) {
                var ageDifMs = Date.now() - birthDate.getTime();
                var ageDate = new Date(ageDifMs); // miliseconds from epoch
                return Math.abs(ageDate.getUTCFullYear() - 1970);
            } else {
                return undefined;
            }
        }

        function cancel() {

        }

        function canDelete() {
            return !vm.isEditing;
        }

        function canSave() {
            return !vm.isSaving;
        }

        function clearErrors() {
            $window.localStorage.errors = JSON.stringify([]);
            loadErrors();
        }

        function deletePatient(patient) {
            return bsDialog.deleteDialog(patient.fullName)
                .then(confirmDelete);

            function confirmDelete() {
                if (patient && patient.resourceId && patient.hashKey) {
                    patientService.deleteCachedPatient(patient.hashKey, patient.resourceId)
                        .then(function () {
                            logSuccess("Deleted patient " + patient.fullName);
                            $location.path('/patients');
                        },
                        function (error) {
                            logError(common.unexpectedOutcome(error));
                        }
                    );
                }
            }
        }

        function loadErrors() {
            if ($window.localStorage.errors) {
                vm.errors = JSON.parse($window.localStorage.errors);
            }
        }

        $scope.$on('vitalsUpdateEvent',
            function (event, data) {
                var clone = _.cloneDeep(data);
                var dataEvent = { "profile": clone.group.linkId, "narrative": clone.$$narrative, "date": clone.$$eventDate, "user": clone.$$user, "resourceid": clone.$$resourceId };
/*
                if (dataEvent.profile.indexOf("Allergy") > -1) {
                    vm.history.allergy.list.push(clone);
                    vm.vitals.allergy.push(clone);
                    $window.localStorage.allergy = JSON.stringify(vm.history.allergy.list);
                    $window.localStorage.vitals = JSON.stringify(vm.vitals);
                } else if (dataEvent.profile.indexOf("Medication") > -1) {
                    vm.history.medication.list.push(clone);
                    $window.localStorage.medication = JSON.stringify(vm.history.medication.list);
                } else {
                    vm.history.condition.list.push(clone);
                    $window.localStorage.condition = JSON.stringify(vm.history.condition.list);
                }*/
                vm.dataEvents.push(dataEvent);
                $window.localStorage.dataEvents = JSON.stringify(vm.dataEvents);
                loadErrors();
            }
        );

        function edit(patient) {
            if (patient && patient.hashKey) {
                $location.path('/patient/' + patient.hashKey);
            }
        }

        function getActiveServer() {
            fhirServers.getActiveServer()
                .then(function (server) {
                    vm.activeServer = server;
                });
        }

        function getOrganizationReference(input) {
            var deferred = $q.defer();
            vm.loadingOrganizations = true;
            organizationService.getOrganizationReference(vm.activeServer.baseUrl, input)
                .then(function (data) {
                    vm.loadingOrganizations = false;
                    deferred.resolve(data);
                }, function (error) {
                    vm.loadingOrganizations = false;
                    logError(common.unexpectedOutcome(error));
                    deferred.reject();
                });
            return deferred.promise;
        }

        function getRequestedPatient() {
            vm.lookupKey = $routeParams.hashKey;
            if (vm.lookupKey === "current") {
                if (angular.isUndefined($window.localStorage.patient) || $window.localStorage.patient === "null") {
                    if (angular.isUndefined($routeParams.id)) {
                        //redirect to search
                        $location.path('/patients');
                    }
                } else {
                    vm.patient = JSON.parse($window.localStorage.patient);
                    vm.patient.hashKey = "current";
                    intitializeRelatedData(vm.patient);
                }
            }
            if (vm.lookupKey === 'new') {
                var data = patientService.initializeNewPatient();
                intitializeRelatedData(data);
                vm.title = 'Add New Patient';
                vm.isEditing = false;
            } else {
                if (vm.lookupKey !== "current") {
                    patientService.getCachedPatient(vm.lookupKey)
                        .then(intitializeRelatedData, function (error) {
                            logError(common.unexpectedOutcome(error));
                        });
                } else if ($routeParams.id) {
                    var resourceId = vm.activeServer.baseUrl + '/Patient/' + $routeParams.id;
                    patientService.getPatient(resourceId)
                        .then(intitializeRelatedData, function (error) {
                            logError(common.unexpectedOutcome(error));
                        });
                }
            }

            function intitializeRelatedData(data) {
                vm.patient = data;
                humanNameService.init(vm.patient.name);
                demographicsService.init(vm.patient.gender, vm.patient.maritalStatus, vm.patient.communication);
                demographicsService.initBirth(vm.patient.multipleBirthBoolean, vm.patient.multipleBirthInteger);
                demographicsService.initDeath(vm.patient.deceasedBoolean, vm.patient.deceasedDateTime);
                demographicsService.setBirthDate(vm.patient.birthDate);
                attachmentService.init(vm.patient.photo, "Photos");
                identifierService.init(vm.patient.identifier);
                addressService.init(vm.patient.address, true);
                telecomService.init(vm.patient.telecom, true, true);
                vm.patient.fullName = humanNameService.getFullName();
                questionnaireAnswerService.init(vm.patient);
                if (vm.patient.managingOrganization && vm.patient.managingOrganization.reference) {
                    var reference = vm.patient.managingOrganization.reference;
                    if (common.isAbsoluteUri(reference) === false) {
                        vm.patient.managingOrganization.reference = vm.activeServer.baseUrl + '/' + reference;
                    }
                    if (angular.isUndefined(vm.patient.managingOrganization.display)) {
                        vm.patient.managingOrganization.display = reference;
                    }
                }
                vm.title = getTitle();
                $window.localStorage.patient = JSON.stringify(vm.patient);
            }
        }

        function initStoredVitals() {
            if ($window.localStorage.vitals) {
                if ($window.localStorage.vitals.length > 0) {
                    vm.vitals = JSON.parse($window.localStorage.vitals);
                }
            }
            if ($window.localStorage.allergy) {
                if ($window.localStorage.allergy.length > 0) {
                    vm.history.allergy.list = JSON.parse($window.localStorage.allergy);
                }
            }
            if ($window.localStorage.medication) {
                if ($window.localStorage.medication.length > 0) {
                    vm.history.medication.list = JSON.parse($window.localStorage.medication);
                }
            }
            if ($window.localStorage.condition) {
                if ($window.localStorage.condition.length > 0) {
                    vm.history.condition.list = JSON.parse($window.localStorage.condition);
                }
            }
            if ($window.localStorage.dataEvents) {
                if ($window.localStorage.dataEvents.length > 0) {
                    vm.dataEvents = JSON.parse($window.localStorage.dataEvents);
                }
            }
        }

        function getTitle() {
            var title = '';
            if (vm.patient) {
                title = 'Edit ' + (vm.patient.fullName || 'Unknown');
            } else {
                title = 'Add New Patient';
            }
            return title;

        }

        function goBack() {
            $location.path('/patients');
        }

        function save() {
            var patient = patientService.initializeNewPatient();
            if (humanNameService.getAll().length === 0) {
                logError("Patient must have at least one name entry.");
                return;
            }
            toggleSpinner(true);
            patient.name = humanNameService.mapFromViewModel();
            patient.photo = attachmentService.getAll();

            patient.birthDate = demographicsService.getBirthDate();
            patient.gender = demographicsService.getGender();
            patient.maritalStatus = demographicsService.getMaritalStatus();
            patient.multipleBirthBoolean = demographicsService.getMultipleBirth();
            patient.multipleBirthInteger = demographicsService.getBirthOrder();
            patient.deceasedBoolean = demographicsService.getDeceased();
            patient.deceasedDateTime = demographicsService.getDeceasedDate();
            patient.communication = demographicsService.getLanguage();

            patient.address = addressService.mapFromViewModel();
            patient.telecom = telecomService.mapFromViewModel();
            patient.identifier = identifierService.getAll();

            patient.managingOrganization = vm.patient.managingOrganization;

            patient.active = vm.patient.active;
            if (vm.isEditing) {
                patientService.updatePatient(vm.patient.resourceId, patient)
                    .then(processResult,
                    function (error) {
                        logError(common.unexpectedOutcome(error));
                        toggleSpinner(false);
                    });
            } else {
                patientService.addPatient(patient)
                    .then(processResult,
                    function (error) {
                        logError(common.unexpectedOutcome(error));
                        toggleSpinner(false);
                    });
            }

            function processResult(results) {
                var resourceVersionId = results.headers.location || results.headers["content-location"];
                if (angular.isUndefined(resourceVersionId)) {
                    logWarning("Patient saved, but location is unavailable. CORS not implemented correctly at remote host.");
                } else {
                    logSuccess("Patient saved at " + resourceVersionId);
                    vm.patient.resourceVersionId = resourceVersionId;
                    vm.patient.resourceId = common.setResourceId(vm.patient.resourceId, resourceVersionId);
                }
                vm.patient.fullName = humanNameService.getFullName();
                vm.isEditing = true;
                vm.title = getTitle();
                $window.localStorage.patient = JSON.stringify(vm.patient);
                toggleSpinner(false);
            }
        }

        function toggleSpinner(on) {
            vm.isBusy = on;
        }
    }
})();