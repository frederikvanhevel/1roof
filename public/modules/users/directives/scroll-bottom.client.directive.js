'use strict';

angular.module('users').directive('scrollBottom', [ '$timeout',
  function($timeout) {
        return {
            require: 'ngModel',
            scope: {
                model: '=ngModel'
            },
            restrict: 'A',
            link: function(scope, $el, attrs){
                var el = $el[0];

                function scrollToBottom() {
                    el.scrollTop = el.scrollHeight;
                }

                scope.$parent.$on('messages_rendered', function() {
                    $timeout(function() {
                        scrollToBottom();
                    }, 100);
                });                
                scope.$watch('model', function(newValue, oldValue){
                    if (newValue) scrollToBottom();
                });
            }
        };
    }
]);