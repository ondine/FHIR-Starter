(function () {
    'use strict';

    var controllerId = 'demographics';

    angular.module('FHIRStarter').controller(controllerId, ['common', 'demographicsService', 'localValueSets', demographics]);

    function demographics(common, demographicsService, localValueSets) {
        var vm = this;

        vm.demographics = {
            "birthDate": null,
            "gender": null,
            "maritalStatus": null,
            "multipleBirth": false
        };
        vm.updateBirthDate = updateBirthDate;
        vm.updateGender = updateGender;
        vm.updateMaritalStatus = updateMaritalStatus;
        vm.updateMultipleBirth = updateMultipleBirth;

        activate();

        function activate() {
            common.activateController([getGenders(), getMaritalStatuses()], controllerId).then(function () {
                initData()
            });
        }

        function getGenders() {
            vm.genders = localValueSets.administrativeGender();
        }

        function getMaritalStatuses() {
            vm.maritalStatuses = localValueSets.maritalStatus();
        }

        function initData() {
            vm.demographics.birthDate = demographicsService.getBirthDate();
            vm.demographics.gender = demographicsService.getGender();
            vm.demographics.maritalStatus = demographicsService.getMaritalStatus();
            vm.demographics.multipleBirth = demographicsService.getMultipleBirth();
        }

        function updateBirthDate() {
            demographicsService.setBirthDate(vm.demographics.birthDate);
        }

        function updateGender() {
            demographicsService.setGender(vm.demographics.gender);
        }

        function updateMaritalStatus() {
            demographicsService.setMaritalStatus(vm.demographics.maritalStatus);
        }

        function updateMultipleBirth() {
            demographicsService.setMultipleBirth(vm.demographics.multipleBirth);
        }
    }
})();
