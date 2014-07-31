'use strict';

angular.module('core').directive('dropboxChooser', [ '$window',
  function($window) {
    return {
        restrict: 'A',
        scope: {
          chooserSuccess: '='
        },
        link: function(scope, element, attributes ) {
          var options = {
            success: scope.chooserSuccess,
            linkType: 'direct', 
            multiselect: false,
            extensions: ['images'],
          };

          var button = $window.Dropbox.createChooseButton(options);
          element.append(button);
        }
    };
  }
]);