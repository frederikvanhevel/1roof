'use strict';

angular.module('core').directive('animateElement', ['$window',
    function($window) {
        return {
            restriction: 'A',
            link: function(scope, element, attrs) {

                var waypointClass = 'main [class*="col-"]';
                var animationClass = 'fadeInUp';
                var delayTime;
                element.css({
                    opacity: '0'
                });

                element.waypoint(function() {
                    delayTime += 100;
                    $window.$(this).delay(delayTime).queue(function(next) {
                        $window.$(this).toggleClass('animated');
                        $window.$(this).toggleClass(animationClass);
                        delayTime = 0;
                        next();
                    });
                }, {
                    offset: '90%',
                    triggerOnce: true
                });

            }
        };
    }
]);
