'use strict';

angular.module('rooms').directive('roomMap', [ '$window', '$rootScope',
  function($window, $rootScope) {
    return {
      template: '<div id="map" class="map-canvas"></div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        $rootScope.$on('room_loaded', function(event, coords) {

          var mapOptions = {
            center: new $window.google.maps.LatLng(coords[1], coords[0]),
            zoom: 15,
            disableDefaultUI: true,
            zoomControl: true,
            draggable: false,
            disableDoubleClickZoom: true,
            zoomControlOptions: {
              style: $window.google.maps.ZoomControlStyle.SMALL
            },
            mapTypeId: $window.google.maps.MapTypeId.ROADMAP
          };


          var map = new $window.google.maps.Map(element[0], mapOptions);
          var marker = new $window.google.maps.Marker({
            map: map,
            position: mapOptions.center,
            icon: new $window.google.maps.MarkerImage('/modules/rooms/img/map-marker2.svg')
          });
        });      
      }
    };
  }
]);