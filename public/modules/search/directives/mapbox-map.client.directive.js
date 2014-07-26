'use strict';

angular.module('search').directive('mapboxMap', [ '$compile', '$q', '$window',
  function($compile, $q, $window) {

    var _mapboxMap;

    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        center: '=mapCenter',
        zoom: '=mapZoom',
        changedEvent: '=mapChanged',
        preventPopups: '=preventPopups'
      },
      template: '<div class="map-canvas" ng-transclude></div>',

      link: function(scope, element, attrs) {

        scope.map = $window.L.mapbox.map(element[0], 'defreek.j27p0821')
            .setView([scope.center[1], scope.center[0]], scope.zoom);

        _mapboxMap.resolve(scope.map);

        if (scope.changedEvent) {
          scope.map.on('moveend', function(e) {
            var center = scope.map.getCenter();

            scope.changedEvent({
              lng: center.lng,
              lat: center.lat,
              proximity: getBoundsDistance()
            });
          });
        }

        scope.$on('open_marker_popup', function(event, id) {
          if (!scope.preventPopups) openMarkerPopupById(id);
        });
        scope.$on('close_marker_popups', function(event) {
          scope.markers.forEach(function(marker) {
            marker.closePopup();
          });
        });

        function openMarkerPopupById(roomId) {
          scope.markers.forEach(function(marker) {
            if (marker.roomId === roomId) {
              marker.openPopup();
            }
          });
        }

        function getBoundsDistance() {
          var bounds = scope.map.getBounds();
          var northWest = bounds.getNorthWest();
          var southEast = bounds.getSouthEast();

          return Math.floor(northWest.distanceTo(southEast));
        }

      },
      controller: function($scope) {
        $scope.markers = [];
        $scope.featureLayers = [];

        _mapboxMap = $q.defer();
        $scope.getMap = this.getMap = function() {
          return _mapboxMap.promise;
        };

        this.$scope = $scope;
      }
    };
  }
]);
