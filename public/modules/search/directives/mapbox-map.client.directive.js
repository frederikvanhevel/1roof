'use strict';

angular.module('search').directive('mapboxMap', [ '$compile', '$q', '$window', '$http', '$timeout',
  function($compile, $q, $window, $http, $timeout) {

    var _mapboxMap;

    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        center: '=mapCenter',
        zoom: '=mapZoom',
        changedEvent: '=mapChanged',
        preventPopups: '=',
        selectRoom: '='
      },
      template: '<div class="map-canvas" ng-transclude></div>',

      link: function(scope, element, attrs) {

        scope.map = $window.L.mapbox.map(element[0], 'defreek.j27p0821')
            .setView([scope.center[1], scope.center[0]], scope.zoom);

        _mapboxMap.resolve(scope.map);

        scope.isClusteringMarkers = attrs.clusterMarkers !== undefined;

        var shouldRefitMap = attrs.scaleToFit !== undefined;
        scope.fitMapToMarkers = function() {
          if(!shouldRefitMap) return;
          // TODO: only call this after all markers have been added, instead of per marker add

          var group = new $window.L.featureGroup(scope.markers);
          scope.map.fitBounds(group.getBounds());
        };

        var foursquareMarkers = new $window.L.featureGroup().addTo(scope.map);

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

        scope.map.on('popupopen', function(e) {
          var popup = angular.element(document.getElementsByClassName('leaflet-popup-content'));
          $compile(popup)(scope);

          $timeout(function() {
            scope.$apply();
          });

        });

        scope.$on('$destroy', function() {
          scope.map.remove();
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

        function getFoursquareData() {
          var center = scope.map.getCenter();

          var params = {
            client_id: '4I5SHYQHG4OXY2ZCCRTFPNYFVK0U0G4NPLIBKLWGM2SWLPVY',
            client_secret: '11YEGLXWQBXX4KERSY2CXLMC4E3C2X021DGZLXVVMK0KRWJZ',
            ll: center.lat + ',' + center.lng,
            radius: getBoundsDistance(),
            v: '20140701',
            categoryId: '4bf58dd8d48988d1ae941735'  // university category
          };

          $http({
            url: 'https://api.foursquare.com/v2/venues/search', 
            method: 'GET',
            params: params
          }).success(function(result) {
            result.response.venues.forEach(function(venue) {

              var latlng = $window.L.latLng(venue.location.lat, venue.location.lng);
              var marker = $window.L.marker(latlng, {
                icon: $window.L.divIcon({className: 'maki-icon college'})
              })
              .bindPopup('<a target="_blank" href="https://foursquare.com/v/' + venue.id + '">' + venue.name + '</a>')
              .addTo(foursquareMarkers);

            });
          });

          //scope.map.on('zoomend', function() {
          //  if (scope.map.getZoom() >= 13) {
          //      foursquareMarkers.setFilter(function() { return true; });
          //  } else {
          //      foursquareMarkers.setFilter(function() { return false; });
          //  }
          //});
        }

        getFoursquareData();

      },
      controller: function($scope) {
        $scope.markers = [];
        $scope.featureLayers = [];

        _mapboxMap = $q.defer();
        $scope.getMap = this.getMap = function() {
          return _mapboxMap.promise;
        };

        if($window.L.MarkerClusterGroup) {
          $scope.clusterGroup = new $window.L.MarkerClusterGroup({ showCoverageOnHover: false });
          this.getMap().then(function(map) {
            map.addLayer($scope.clusterGroup);
          });
        }

        this.$scope = $scope;
      }
    };
  }
]);
