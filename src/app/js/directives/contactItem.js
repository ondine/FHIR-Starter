'use strict';

FHIRStarter.directive('contactItem', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/templates/directives/contactItem.html',
        scope: {
            contact: "=contact",
            edit: "&",
            remove: "&"
        }
    }
});