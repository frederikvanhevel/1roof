'use strict';

angular.module('core').directive('backImg', [
  function() {
    return {
        restriction: 'A',
        scope: {
          imgProvider: '@',
          imgLink: '@'
        },
        link: function(scope, element, attrs ) {

            var url = '';

            if (scope.imgProvider === 'cloudinary')
              url = 'http://res.cloudinary.com/dv8yfamzc/image/upload/' + scope.imgLink + '.png';
            else url = scope.imgLink;

            element.css({
                'background-image': 'url(' + url +')'
            });

        }
    };
  }
]);