'use strict';

angular.module('search').directive('radioGroup', [ '$window',
  function($window) {
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        model: '=ngModel'
      },
      link: function postLink(scope, element, attrs) {
        
        var buttons = element.children('button');
        var active = element.children('button.active');
        scope.model = active.attr('data-val');

        buttons.bind('click', function(e) {
          var el = $window.$(e.currentTarget);

          if (!el.hasClass('active')) {
            buttons.removeClass('active');
            el.addClass('active');
          }

          scope.model = el.attr('data-val');

          e.stopPropagation();
        });

      }
    };
  }
]);