'use strict';

angular.module('search').directive('radioGroup', ['$window', '$timeout',
    function($window, $timeout) {
        return {
            require: 'ngModel',
            restrict: 'A',
            scope: {
                model: '=ngModel',
                outputFunction: '='
            },
            link: function postLink(scope, element, attrs) {

                var buttons = element.children('button');
                var active = element.children('button.active');

                function setModel(data) {
                    scope.model = scope.outputFunction ? scope.outputFunction(data) : data;

                    $timeout(function() {
                        scope.$apply();
                    });
                }

                setModel(active.attr('data-val'));

                buttons.bind('click', function(e) {
                    var el = $window.$(e.currentTarget);

                    if (!el.hasClass('active')) {
                        buttons.removeClass('active');
                        el.addClass('active');
                    }

                    setModel(el.attr('data-val'));

                    e.stopPropagation();
                });
            }
        };
    }
]);
