'use strict';

angular.module('core').directive('blinkText', [

    function() {
        return {
            restrict: 'A',
            link: function(scope, element, attributes) {
                scope.$on('blink_text', function(event) {
                    element.finish().show().fadeOut(1400);
                });
            }
        };
    }
]);
