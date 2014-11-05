'use strict';

angular.module('users').directive('parallax', ['$window',
    function($window) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var offset = Number(attrs.offset) || 0;
                element.css('background-position', 'left ' + (offset) + 'px');

                $window.$($window).scroll(function() {
                    var scrolledY = $window.$($window).scrollTop();
                    console.log(scrolledY);
                    console.log(offset);
                    element.css('background-position', 'left ' + (scrolledY + offset) + 'px');
                });
            }
        };
    }
]);
