'use strict';

angular.module('core').directive('datePicker', [ '$window',
  function($window) {
    return {
      restrict: 'A',
      scope: {
        startDate: '@',
        dateModel: '=',
        minDate: '='
      },
      link: function postLink(scope, element, attrs) {

        scope.appendToELement = attrs.appendElement !== undefined;

        function selectDate(date) {
          scope.dateModel = new Date(date);
          scope.$apply();
        }

        var picker;
        var options = {
          firstDay: 1,
          format: 'DD/MM/YYYY',
          onSelect: selectDate
        };
        
        if (scope.appendToELement) {
          picker = new $window.Pikaday(options);
          element.html(picker.el);
        } else {
          options.field = element[0];
          picker = new $window.Pikaday(options);
        }

        scope.$watch('startDate', function (newVal, oldVal) {
          if (newVal !== oldVal) {
            picker.setDate(new Date(newVal), true);
          }
        });

        scope.$watch('minDate', function() {
          picker.setMinDate(new Date(scope.minDate));
          picker.setDate(new Date(scope.minDate), true);
        });

      }
    };
  }
]);