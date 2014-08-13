(function () {
    'use strict';

    var controllerId = 'demographics';

    angular.module('FHIRStarter').controller(controllerId, ['common', 'demographicsService', 'localValueSets', demographics]);

    function demographics(common, demographicsService, localValueSets) {
        var vm = this;

        vm.demographics = {
            "birthDate": null,
            "birthOrder" : null,
            "deceased": false,
            "deceasedDate": null,
            "gender": null,
            "maritalStatus": null,
            "multipleBirth": false
        };
        vm.updateBirthDate = updateBirthDate;
        vm.updateBirthOrder = updateBirthOrder;
        vm.updateDeceased = updateDeceased;
        vm.updateDeceasedDate = updateDeceasedDate;
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
            vm.demographics.birthOrder = demographicsService.getBirthOrder();
            vm.demographics.deceased = demographicsService.getDeceased();
            vm.demographics.deceasedDate = demographicsService.getDeceasedDate();
            vm.demographics.gender = demographicsService.getGender();
            vm.demographics.maritalStatus = demographicsService.getMaritalStatus();
            vm.demographics.multipleBirth = demographicsService.getMultipleBirth();
        }

        function updateBirthDate() {
            demographicsService.setBirthDate(vm.demographics.birthDate);
        }


        function updateBirthOrder() {
            demographicsService.setBirthOrder(vm.demographics.birthOrder);
        }


        function updateDeceased() {
            demographicsService.setDeceased(vm.demographics.deceased);
        }


        function updateDeceasedDate() {
            demographicsService.setDeceasedDate(vm.demographics.deceasedDate);
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
