'use strict';

FHIRStarter.directive('identifierItem', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/templates/directives/identifierItem.html',
        scope: {
            identifier: "=identifier",
            edit: "&",
            remove: "&"
        }
    }
});