'use strict';

angular.module('core').directive('headerScroll', [ '$window',
    function($window) {
        return {
            restriction: 'A',
            link: function($scope, element, attrs) {
                attrs.$observe('homepage', function(isHomepage) {
                    var enabled = isHomepage === 'true';

                    element.toggleClass('transparent', enabled);
                    
                    if (enabled) {
                        angular.element($window).bind('scroll.header', function() {
                            if (this.pageYOffset >= 100) {
                                element.removeClass('transparent');
                            } else {
                                element.addClass('transparent');
                            }
                        });
                    } else {
                        angular.element($window).unbind('scroll.header');
                    }
                });                
            }
        };
    }
]);