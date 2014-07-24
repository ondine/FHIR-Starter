'use strict';

FHIRStarter.directive('contactItem', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/templates/directives/valueSetItem.html',
        scope: {
            valueset: '=valueset'
        }
    }
});
