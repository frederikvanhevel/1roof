'use strict';

angular.module('rooms').directive('streetView', [ '$window',
  function($window, $rootScope) {
    return {
      scope: {
        center: '=mapCenter'
      },
      template: '<div></div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        scope.$on('room_loaded', function(event, room) {
            var coordinates = room.loc.coordinates;
            var position = new $window.google.maps.LatLng(coordinates[1], coordinates[0]);
            var streetview = new $window.google.maps.StreetViewPanorama(element[0], {
                zoomControl: false,
                position: position,
                pov: {
                    heading: 0,
                    pitch:0,
                    zoom:1
                }
            });

            var streetViewService = new $window.google.maps.StreetViewService();
            var streetViewMaxDistance = 50;

            streetViewService.getPanoramaByLocation(position, streetViewMaxDistance, function (streetViewPanoramaData, status) {
                if(status === $window.google.maps.StreetViewStatus.OK){
                    var oldPoint = position;
                    position = streetViewPanoramaData.location.latLng;

                    var heading = $window.google.maps.geometry.spherical.computeHeading(position,oldPoint);            

                    setStreetViewSettings(streetview, position, heading);
                }
            });
            
            function setStreetViewSettings(streetview, pos, heading) {
                streetview.setPosition(pos);
                streetview.setPov({
                    heading: heading,
                    zoom: 1,
                    pitch: 0
                });
                streetview.setVisible(true);
            }
        });

      }
    };
  }
]);






                    