'use strict';

FHIRStarter.directive('addressItem', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/templates/directives/addressItem.html',
        scope: {
            address: "=address",
            edit: "&",
            remove: "&"
        }
    }
});