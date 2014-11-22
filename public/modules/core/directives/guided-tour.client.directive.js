'use strict';

angular.module('core').directive('guidedTour', [ '$window',
    function($window) {
        return {
            template: '<div class="popover">' +
                 '<div class="arrow"></div>' +
                  '<h3 class="popover-title"><i class="icon-info-circled"></i> Rondleiding</h3>' +
                  '<div class="popover-content">' +
                    '<p class="tour-text"></p>' +
                    '<button style="display: none;" class="tour-close btn btn-blue btn-xs pull-right">Sluiten</button>' +
                    '<button class="tour-next btn btn-green btn-xs pull-right">Volgende <i class="icon-right-1"></i></button><br>' +
                  '</div>' +
               '</div>',
            restriction: 'E',
            transclude: true,
            scope: {
                connectedElement: '@',
                step: '@',
                alignment: '@',
                guide: '='
            },
            link: function(scope, element, attrs) {

                var connectedElement = $window.$(scope.connectedElement);
                var popoverElement = element.find('.popover');

                if (scope.alignment) popoverElement.addClass(scope.alignment);
                if (attrs.laststep) {
                    popoverElement.find('.tour-next').hide();
                    popoverElement.find('.tour-close').show();
                }

                function positionELement() {
                    var pos = connectedElement.position();
                    var width = connectedElement.outerWidth();
                    var top = pos.top;
                    var left = ((width / 2) - (popoverElement.outerWidth() / 2)) + 'px';

                    if (scope.alignment === 'bottom') {
                        top += 20;
                    } else if (scope.alignment === 'right') {
                        top = pos.top;
                        left = connectedElement.outerWidth() + 'px';
                    } else if (scope.alignment === 'bottomleft') {
                        popoverElement.addClass('bottom');

                        top += 90;
                        left = pos.left;
                    }
                    
                    popoverElement.css({
                        position: 'absolute',
                        top: top,
                        left: left
                    }).addClass('active');
                }

                function showOrHide(currentStep) {
                    if (currentStep === +scope.step) {
                        positionELement();
                    } else {
                        popoverElement.removeClass('active');
                    }
                }

                scope.$watch('guide.step', function(newValue, oldValue) {
                    if (newValue !== oldValue) showOrHide(newValue);
                });

                element.find('button').click(function(e) {
                    scope.guide.step++;
                    scope.$apply();

                    e.preventDefault();
                    e.stopPropagation();
                });

                element.find('.tour-text').text(scope.content);
                showOrHide(scope.guide.step);
            },
            controller: function($scope, $transclude) {
                $transclude(function(clone,scope) {
                    $scope.content = clone.text();
                });
            }
        };
    }
]);
