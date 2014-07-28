'use strict';

angular.module('search').controller('SearchController', ['$scope', '$timeout', '$location', '$state', '$stateParams', 'Geocoder', 'Rooms', '$window', 'Amenity', 'Authentication', 'Users',
	function($scope, $timeout, $location, $state, $stateParams, Geocoder, Rooms, $window, Amenity, Authentication, Users) {
    $scope.mapCenter = [4.3517100, 50.8503400]; // Brussel
    $scope.mapZoom = 13;
    $scope.fetchOnMapChange = true;
		$scope.filter = {
      location: [],
      proximity: 3600,
      roomType: [],
      minPrice: 0,
      maxPrice: 2000,
      size: null,
      amenities: []
    };
    $scope.results = [];
    $scope.amenities = Amenity.list();

    $scope.selectedRoomId = null;
    $scope.isOverLayOpen = false;
    

    $scope.init = function() {
      var urlParamaters = $location.search();

      function getZoomLevel(m){
        var z=Math.floor((Math.log(20088000/m))/Math.log(2));
        if (z>19) z=19;
        if (z<0) z=0;
        return z;
      }

      if ((!urlParamaters.lat || !urlParamaters.lng) && $stateParams.address) {
        $scope.doSearchLookup($stateParams.address);
      } else if (urlParamaters.lat && urlParamaters.lng) {
        $scope.parseUrlParameters(urlParamaters);
        $scope.mapCenter = $scope.filter.location;
        $scope.mapZoom = getZoomLevel($scope.filter.proximity);
      } else {
        $scope.mapZoom = 9;
      }

      // Show a room if its in the url
      if ($stateParams.roomId) {
        $scope.selectedRoomId = $stateParams.roomId;
        $scope.showRoomOverlay();
      }

      $scope.$watch('filter', function(newValue, oldValue) {
        if (newValue !== oldValue) $scope.searchFunction();
      }, true);
    };

    $scope.parseUrlParameters = function(urlParamaters) {
      if (urlParamaters.lat && urlParamaters.lng) $scope.filter.location = [ parseFloat(urlParamaters.lng), parseFloat(urlParamaters.lat) ];
      if (urlParamaters.proximity) $scope.filter.proximity = urlParamaters.proximity;
      if (urlParamaters.minPrice) $scope.filter.minPrice = +urlParamaters.price;
      if (urlParamaters.maxPrice) $scope.filter.maxPrice = +urlParamaters.maxPrice;
      if (urlParamaters.roomType) $scope.filter.roomType = urlParamaters.roomType;
      if (urlParamaters.size) $scope.filter.size = +urlParamaters.size;
      if (urlParamaters.amneties) $scope.filter.amneties = urlParamaters.amneties;
    };

    $scope.doSearchLookup = function(address) {
      Geocoder.geocodeAddress(address).then(function(result) {
        //$location.search('lat', result.lat).search('lng', result.lng);
        $scope.mapCenter = [result.lng, result.lat];
        $scope.filter.proximity = result.proximity;
      });
    };

    $scope.mapChangedEvent = function(result) {
      $scope.filter.proximity = result.proximity / 2;
      $scope.filter.location = [result.lng, result.lat];

      $location.search('lat', result.lat).search('lng', result.lng).search('proximity', $scope.filter.proximity);
      
      // Prevent digest errors
      $timeout(function() {
        $scope.$apply();
      });
      
    };

    $scope.fetchRooms = function() {
      Rooms.query($scope.filter, function(results) {

        // Non-destructively rebuild the array of rooms, otherwise all the markers would
        // be replaced and popups would be closed, confusing the user

        var oldRooms = $scope.results;
        var newRooms = results;

        var oldIds = oldRooms.map(function(room) {
          return room._id;
        });
        var newIds = newRooms.map(function(room) {
          return room._id;
        });

        var toDelete = $window._.difference(oldIds, newIds);
        var toAdd = $window._.difference(newIds, oldIds);

        oldRooms = oldRooms.filter(function(room) {
          return !$window._.contains(toDelete, room._id);
        });

        newRooms.forEach(function(room) {
          if ($window._.contains(toAdd, room._id)) oldRooms.push(room);
        });

        $scope.results = oldRooms;
      });
    };

    $scope.runSearch = function() {
      $scope.fetchRooms();
    };

    $scope.toggleAmenitySelection = function(amenity) {
        var idx = $scope.filter.amenities.indexOf(amenity);

        if (idx > -1) {
          $scope.filter.amenities.splice(idx, 1);
        }
        else {
          $scope.filter.amenities.push(amenity);
        }
    };

    $scope.saveQueryAsUserAlert = function() {
      if (Authentication.user) {
        var query = angular.copy($scope.filter);
        // Set bigger proximity
        query.proximity = 50000;

        Authentication.user.alerts.push({ filters: query });
        var user = new Users(Authentication.user);
        user.$update();
      }
    };

    $scope.selectRoom = function(roomId) {
      if (!$scope.selectedRoomId || $scope.selectedRoomId !== roomId) {
        $scope.selectedRoomId = roomId;

        $window._.extend($stateParams,{ roomId: roomId });

        $scope.showRoomOverlay();

        $scope.isOverLayOpen = true;
      } else {
        $scope.selectedRoomId = null;

        $state.transitionTo('search', $stateParams, { reload: false, location: false });
        
        $scope.isOverLayOpen = false;
      } 
    };

    $scope.openRoomPopup = function(roomId) {
      $scope.$broadcast('open_marker_popup', roomId);
    };

    $scope.showRoomOverlay = function() {
      $state.transitionTo('search.overlay', $stateParams, { reload: false, location: false });
      $scope.$broadcast('close_marker_popups');
    };

    $scope.searchFunction = $window._.debounce($scope.fetchRooms, 400);
	}
]);