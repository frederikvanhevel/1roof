'use strict';

angular.module('search').directive('checkboxGroup', ['$window',
    function($window) {
        return {
            require: 'ngModel',
            restrict: 'A',
            scope: {
                model: '=ngModel'
            },
            link: function postLink(scope, element, attrs) {

                var buttons = element.children('button');

                buttons.bind('click', function(e) {
                    var el = $window.$(e.currentTarget);
                    var val = el.attr('data-val');
                    var index = scope.model.indexOf(val);

                    if (el.hasClass('active')) {
                        if (index !== -1) scope.model.splice(index, 1);
                        el.removeClass('active');
                    } else {
                        if (index === -1) scope.model.push(val);
                        el.addClass('active');
                    }

                    e.stopPropagation();
                });

            }
        };
    }
]);
