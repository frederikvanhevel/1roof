'use strict';

angular.module('core').directive('guidedTour', [

    function() {
        return {
            restriction: 'A',
            scope: {
                currentStep: '@'
            },
            link: function(scope, element, attrs) {

                

            }
        };
    }
]);
