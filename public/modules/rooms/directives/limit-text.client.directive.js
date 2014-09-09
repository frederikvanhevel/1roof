'use strict';

angular.module('core').directive('limitText', [

    function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            scope: {
                model: '=ngModel'
            },
            link: function(scope, element, attributes) {
                scope.$watch('model', function(newValue, oldValue) {
                    if (newValue !== oldValue && scope.model) {
                        scope.model = scope.model.substring(0, attributes.limitText);
                    }
                });
            }
        };
    }
]);
