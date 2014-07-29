'use strict';

angular.module('core').directive('videoBackground', [ '$window',
  function($window) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        
        element.vide(attrs.videoPath, {
            volume: 1,
            playbackRate: 1,
            muted: true,
            loop: true,
            autoplay: true,
            position: '50% 50%' // Alignment
        });

        scope.$on('$destroy', function() {
          var instance = element.data('vide'); // Get instance
          instance.destroy(); // Destroy instance
        });

      }
    };
  }
]);