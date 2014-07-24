'use strict';

FHIRStarter.directive('searchItem', function() {
    return {
        restrict: 'E',
        replace: true,
        require: true,
        templateUrl: '/templates/directives/searchItem.html',
        scope: {
            name: "@name",
            resourceid: "@resourceid",
            summary: "@summary",
            edit: "&",
            remove: "&"
        }
    }
});