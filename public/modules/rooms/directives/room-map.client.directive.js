'use strict';

angular.module('rooms').directive('roomMap', [ '$window',
  function($window) {
    return {
      template: '<div id="map" class="map-canvas"></div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.$on('room_loaded', function(event, loc) {

          var map = $window.L.mapbox.map(element[0], 'defreek.j27p0821', {
            zoomControl: false
          }).setView([loc.coordinates[1], loc.coordinates[0]], 15);

          // Disable drag and zoom handlers.
          map.dragging.disable();
          map.touchZoom.disable();
          map.doubleClickZoom.disable();
          map.scrollWheelZoom.disable();

          // Disable tap handler, if present.
          if (map.tap) map.tap.disable();

          $window.L.mapbox.featureLayer({
            type: 'Feature',
            geometry: loc,
            properties: {
              'marker-size': 'medium',
              'marker-color': '#f44',
              'marker-symbol': 'lodging'
            }
          }).addTo(map);

        });      
      }
    };
  }
]);