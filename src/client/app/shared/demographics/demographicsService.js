(function () {
    'use strict';

    var serviceId = 'demographicsService';

    angular.module('FHIRStarter').factory(serviceId, [demographicsService]);

    function demographicsService() {
        var _birthDate = null;
        var _multipleBirth = false;
        var _gender = 'UNK';
        var _maritalStatus = null;

        var service = {
            getBirthDate: getBirthDate,
            getGender: getGender,
            getMaritalStatus: getMaritalStatus,
            getMultipleBirth: getMultipleBirth,
            init: init,
            setBirthDate: setBirthDate,
            setGender: setGender,
            setMaritalStatus: setMaritalStatus,
            setMultipleBirth: setMultipleBirth,
        }

        return service;

        function getBirthDate() {
            return _birthDate;
        }
        
        function getGender() {
            return _gender;
        }
        
        function getMaritalStatus () {
            return _maritalStatus;
        }
        
        function getMultipleBirth() {
            return _multipleBirth;
        }

        function init(birthDate, multipleBirth, gender, maritalStatus) {
            _birthDate = birthDate;
            _multipleBirth = multipleBirth;
            _gender = gender;
            _maritalStatus = maritalStatus;
        }

        function setBirthDate(value) {
            _birthDate = value;
        }

        function setGender(value) {
            _gender = value;
        }

        function setMaritalStatus (value) {
            _maritalStatus = value;
        }

        function setMultipleBirth(value) {
            _multipleBirth = value;
        }
    }
})();