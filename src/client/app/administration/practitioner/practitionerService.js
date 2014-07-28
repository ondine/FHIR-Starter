(function () {
    'use strict';

    var serviceId = 'organizationService';

    // TODO: replace app with your module name
    angular.module('app').factory(serviceId, ['$http', organizationService]);

    function organizationService($http) {
        // Define the functions and properties to reveal.
        var service = {
            getData: getData
        };

        return service;

        function getData() {

        }

        //#region Internal Methods        

        //#endregion
    }
})();