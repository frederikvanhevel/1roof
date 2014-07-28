'use strict';

angular.module('rooms').directive('roomMap', [ '$window',
  function($window) {
    return {
      template: '<div id="map" class="map-canvas"></div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.$on('room_loaded', function(event, room) {

          var map = $window.L.mapbox.map(element[0], 'defreek.j27p0821', {
            zoomControl: false
          }).setView([room.loc.coordinates[1], room.loc.coordinates[0]], 15);

          // Disable drag and zoom handlers.
          map.dragging.disable();
          map.touchZoom.disable();
          map.doubleClickZoom.disable();
          map.scrollWheelZoom.disable();

          // Disable tap handler, if present.
          if (map.tap) map.tap.disable();

          $window.L.mapbox.featureLayer({
            type: 'Feature',
            geometry: room.loc,
            properties: {
              'marker-size': 'medium',
              'marker-color': '#f44',
              'marker-symbol': getRoomTypeIcon(room.classification)
            }
          }).addTo(map);

        });      

        function getRoomTypeIcon(roomType) {
          if (roomType === 'room') return 'lodging';
          else if (roomType === 'appartment') return 'commercial';
          else return 'building';
        }
      }
    };
  }
]);