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

      	var enablePopups = true;

        var map = $window.L.mapbox.map(element[0], 'defreek.j27p0821')
          .setView([scope.center[1], scope.center[0]], scope.zoom);

        var markerLayer = $window.L.mapbox.featureLayer().addTo(map);
        markerLayer.on('layeradd', function(e) {
          var marker = e.layer,
              room = marker.feature.properties.room;

          var image = room.pictures.length > 0 ? room.pictures[0] : '';
          var popupContent = '' +
            '<div class="row marker" style="background-image:url(//res.cloudinary.com/dv8yfamzc/image/upload/' + image + '.png);">' +
              '<div class="col-xs-12">' +

                '<div class="pull-right">' +
                  '<a href="#" class="btn btn-default btn-xs">More info <i class="icon-right-open-1"></i></a>' +
                '</div>' +
                '<h1>' + room.location.street + '</h1>' +

                '<span class="bottom-right">&euro; ' + room.price.total + '</span>' +

              '</div>' +
            '</div>';

          // http://leafletjs.com/reference.html#popup
          marker.bindPopup(popupContent,{
              closeButton: false,
              minWidth: 320
          });
        });

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

        scope.$on('room_hover', function(event, id) {
          if (enablePopups) openMarkerPopupById(id);
        });
        scope.$on('overlay_open', function(event, id) {
        	enablePopups = false;
        	closePopups();
        });
        scope.$on('overlay_closed', function(event, id) {
        	enablePopups = true;
          	closePopups();
        });
        scope.$watchCollection('markers', function(newValues, oldValues) {
          if (newValues !== oldValues) {

            //var toAdd = getDifferenceOfArrays(oldValues, newValues);
            //var toRemove = getDifferenceOfArrays(newValues, oldValues);

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
            return {
              type: 'Feature',
              geometry: marker.loc,
              properties: {
                  id: marker._id,
                  room: marker,
                  // one can customize markers by adding simplestyle properties
                  // https://www.mapbox.com/foundations/an-open-platform/#simplestyle
                  'marker-size': 'medium',
                  'marker-color': '#f44',
                  'marker-symbol': 'lodging'
              }
            };
          });
          markerLayer.setGeoJSON(mappedMarkers);
        }

        function openMarkerPopupById(roomId) {
          markerLayer.eachLayer(function(marker) {
            if (marker.feature.properties.id === roomId) {
              marker.openPopup();
            }
          });
        }

        function closePopups() {
          markerLayer.eachLayer(function(marker) {
            marker.closePopup();
          });
        }

        function getBoundsDistance() {
          var bounds = map.getBounds();
          var northWest = bounds.getNorthWest();
          var southEast = bounds.getSouthEast();

          return Math.floor(northWest.distanceTo(southEast));
        }

        function getDifferenceOfArrays(firstArray, secondArray) {
          // Make hashtable of ids in B
          var oldIds = {};
          firstArray.forEach(function(room){
              oldIds[room._id] = room;
          });

          // Return all elements in A, unless in B
          return secondArray.filter(function(room){
      		return !(room._id in oldIds);
          });
        }

      }
    };
  }
]);