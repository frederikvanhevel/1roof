'use strict';

angular.module('core').directive('headerScroll', [ '$window',
    function($window) {
        return {
            restriction: 'A',
            link: function($scope, element, attrs) {
                function setTransparency() {
                    if ($window.pageYOffset >= 100) {
                        element.removeClass('transparent');
                    } else {
                        element.addClass('transparent');
                    }
                }

                attrs.$observe('transparent', function(isHomepage) {
                    var enabled = isHomepage === 'true';

                    element.toggleClass('transparent', enabled);
                    
                    if (enabled) {
                        setTransparency();

                        angular.element($window).bind('scroll.header', function() {
                           setTransparency();
                        });
                    } else {
                        angular.element($window).unbind('scroll.header');
                    }
                });                
            }
        };
    }
]);