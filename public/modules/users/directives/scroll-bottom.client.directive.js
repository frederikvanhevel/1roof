'use strict';

angular.module('users').directive('scrollBottom',
    function() {
        return {
            require: 'ngModel',
            scope: {
                model: '=ngModel'
            },
            restrict: 'A',
            link: function(scope, $el, attrs){
                var el = $el[0];

                function scrollToBottom(){
                    el.scrollTop = el.scrollHeight;
                }
                
                scope.$watch('model', function(newValue, oldValue){
                    if (newValue) scrollToBottom();
                });
            }
        };
    }
);