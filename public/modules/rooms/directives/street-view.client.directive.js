'use strict';

angular.module('rooms').directive('streetView', [ '$window', '$rootScope',
  function($window, $rootScope) {
    return {
      scope: {
        center: '=mapCenter'
      },
      template: '<div></div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        $rootScope.$on('room_loaded', function(event, coords) {
            var position = new $window.google.maps.LatLng(coords[1], coords[0]);
            var streetview = new google.maps.StreetViewPanorama(element[0], {
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
                if(status === google.maps.StreetViewStatus.OK){
                    var oldPoint = position;
                    position = streetViewPanoramaData.location.latLng;

                    var heading = google.maps.geometry.spherical.computeHeading(position,oldPoint);            

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






                    