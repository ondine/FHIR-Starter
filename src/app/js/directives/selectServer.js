'use strict';

FHIRStarter.directive('selectServer', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                attrs.$set('class', 'active');
            })
        }
    };
});
