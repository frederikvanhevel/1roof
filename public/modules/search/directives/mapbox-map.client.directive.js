'use strict';

angular.module('search').directive('mapboxMap', [ '$window',
  function($window) {
    return {
      scope: {
        markers: '=mapMarkers',
        center: '=mapCenter',
        zoom: '=mapZoom',
        options: '=mapOptions',
        changedEvent: '=mapChanged'
      },
      template: '<div id="map" class="map-canvas"></div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        var markerLayer = null;

        var map = $window.L.mapbox.map(element[0], 'defreek.j27p0821')
          .setView([scope.center[1], scope.center[0]], scope.zoom);

        if (scope.changedEvent) {
          map.on('moveend', function(e) {
            var center = map.getCenter();

            scope.changedEvent({
              lng: center.lng,
              lat: center.lat,
              proximity: getBoundsDistance()
            });
          });
        }

        scope.$watchCollection('markers', function(newValues, oldValues) {
          if (newValues !== oldValues) {
            if (markerLayer !== null) markerLayer.clearLayers();

            addMarkers(newValues);
          }
        });
        scope.$watch('center', function(newValue, oldValue) {
          if (newValue !== oldValue)
            map.setView([newValue[1], newValue[0]], scope.zoom);
        });
        scope.$watch('zoom', function(newValue, oldValue) {
          if (newValue !== oldValue)
            map.setZoom(newValue);
        });

        function addMarkers(markers) {

          var mappedMarkers = markers.map(function(marker) {
            console.log(marker);
            return {
              type: 'Feature',
              geometry: marker.loc,
              properties: {
                  title: marker.info.title,
                  description: marker.info.description,
                  // one can customize markers by adding simplestyle properties
                  // https://www.mapbox.com/foundations/an-open-platform/#simplestyle
                  'marker-size': 'medium',
                  'marker-color': '#f44',
                  'marker-symbol': 'lodging'
              }
            };
          });

          markerLayer = $window.L.mapbox.featureLayer({
            type: 'FeatureCollection',
            features: mappedMarkers
          }).addTo(map);
        }

        function getBoundsDistance() {
          var bounds = map.getBounds();
          var northWest = bounds.getNorthWest();
          var southEast = bounds.getSouthEast();

          return Math.floor(northWest.distanceTo(southEast));
        }

      }
    };
  }
]);