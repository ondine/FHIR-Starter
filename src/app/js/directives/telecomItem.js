'use strict';

FHIRStarter.directive('telecomItem', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/templates/directives/telecomItem.html',
        scope: {
            telecom: "=telecom",
            edit: "&",
            remove: "&"
        }
    }
});