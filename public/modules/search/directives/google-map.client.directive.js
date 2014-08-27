'use strict';

angular.module('search').directive('googleMap', [ '$window',
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
        var markers = [];
        var mapOptions = {
          center: new $window.google.maps.LatLng(scope.center[1], scope.center[0]),
          zoom: scope.zoom,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: {
				    style: $window.google.maps.ZoomControlStyle.SMALL
				  },
    			mapTypeId: $window.google.maps.MapTypeId.ROADMAP
        };


        var map = new $window.google.maps.Map(element[0], mapOptions);

        if (scope.changedEvent) {
	        map.addListener('dragend', function() {
	        	scope.changedEvent({
              lng: map.getCenter().lng(),
              lat: map.getCenter().lat(),
              proximity: calculateProximity()
            });
	        });
          map.addListener('zoom_changed', function() {
            scope.changedEvent({
              lng: map.getCenter().lng(),
              lat: map.getCenter().lat(),
              proximity: calculateProximity()
            });
          });
		    }

        scope.$watchCollection('markers', function(newValues, oldValues) {
          if (newValues !== oldValues) {
            clearMarkers();

            newValues.forEach(function(value) {
              var marker = new $window.google.maps.Marker({
                map: map,
                position: new $window.google.maps.LatLng(value.loc.coordinates[1], value.loc.coordinates[0]),
                icon: new $window.google.maps.MarkerImage('/modules/rooms/img/map-marker2.svg')
              });
              markers.push(marker);
            });

          }
        });
        scope.$watch('center', function(newValue, oldValue) {
					if (newValue !== oldValue)
						map.setCenter(new $window.google.maps.LatLng(newValue[1], newValue[0]));
				});
				scope.$watch('zoom', function(newValue, oldValue) {
					if (newValue !== oldValue)
						map.setZoom(newValue);
				});

        function calculateProximity() {
            // http://stackoverflow.com/questions/3525670/radius-of-viewable-region-in-google-maps-v3
            // Get Gmap radius / proximity start
            // First, determine the map bounds
            var bounds = map.getBounds();

            // Then the points
            var swPoint = bounds.getSouthWest();
            var nePoint = bounds.getNorthEast();

            // Now, each individual coordinate
            //var swLat = swPoint.lat();
            //var swLng = swPoint.lng();
            //var neLat = nePoint.lat();
            //var neLng = nePoint.lng();

            return $window.google.maps.geometry.spherical.computeDistanceBetween(swPoint, nePoint);
        }

        function clearMarkers() {
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];
        }
			}
		};
	}
]);