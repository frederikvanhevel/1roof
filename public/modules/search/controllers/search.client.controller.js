'use strict';

angular.module('search').controller('SearchController', ['$rootScope', '$scope', '$timeout', '$location', '$state', '$stateParams', 'Geocoder', 'Rooms', '$window', 'Amenity', 'Authentication', 'Users',
	function($rootScope, $scope, $timeout, $location, $state, $stateParams, Geocoder, Rooms, $window, Amenity, Authentication, Users) {
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

    var viewedRooms = [];
    

    $scope.init = function() {
      var urlParamaters = $location.search();

      function getZoomLevel(m){
        var z=Math.floor((Math.log(20088000/m))/Math.log(2));
        if (z>19) z=19;
        if (z<0) z=0;
        return z;
      }

      if ((!urlParamaters.lat || !urlParamaters.lng) && $stateParams.address) {
        doSearchLookup($stateParams.address);
      } else if (urlParamaters.lat && urlParamaters.lng) {
        parseUrlParameters(urlParamaters);

        $scope.mapCenter = $scope.filter.location;
        $scope.mapZoom = getZoomLevel($scope.filter.proximity);
      } else {
        $scope.mapZoom = 9;
      }

      // Show a room if its in the url
      if ($stateParams.roomId) {
        $scope.selectedRoomId = $stateParams.roomId;
        showRoomOverlay();
      }

      $scope.fetchRooms();

      $rootScope.$on('close_overlay', closeRoomOverlay);

      $scope.$watch('filter', function(newValue, oldValue) {
         console.log('eek');
        if (newValue !== oldValue) $scope.searchFunction();
      }, true);
    };

    function parseUrlParameters(urlParamaters) {
      if (urlParamaters.lat && urlParamaters.lng) $scope.filter.location = [ parseFloat(urlParamaters.lng), parseFloat(urlParamaters.lat) ];
      if (urlParamaters.proximity) $scope.filter.proximity = urlParamaters.proximity;
      if (urlParamaters.minPrice) $scope.filter.minPrice = +urlParamaters.price;
      if (urlParamaters.maxPrice) $scope.filter.maxPrice = +urlParamaters.maxPrice;
      if (urlParamaters.roomType) $scope.filter.roomType = urlParamaters.roomType;
      if (urlParamaters.size) $scope.filter.size = +urlParamaters.size;
      if (urlParamaters.amneties) $scope.filter.amneties = urlParamaters.amneties;
    }

    function doSearchLookup(address) {
      Geocoder.geocodeAddress(address).then(function(result) {
        //$location.search('lat', result.lat).search('lng', result.lng);
        $scope.mapCenter = [result.lng, result.lat];
        $scope.filter.proximity = result.proximity;
      });
    }

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

        Authentication.user.alerts.push({ filters: query });
        var user = new Users(Authentication.user);
        user.$update();
      }
    };

    $scope.selectRoom = function(roomId) {
      if (!$scope.selectedRoomId || $scope.selectedRoomId !== roomId) {
        $scope.selectedRoomId = roomId;

        $window._.extend($stateParams,{ roomId: roomId, isOverlay: true });

        showRoomOverlay();

        if (viewedRooms.indexOf(roomId) === -1) viewedRooms.push(roomId);

      } else {
        $scope.selectedRoomId = null;

        closeRoomOverlay();
      } 
    };

    $scope.hasSeenRoom = function(roomId) {
      return viewedRooms.indexOf(roomId) !== -1;
    };

    $scope.openRoomPopup = function(roomId) {
      $scope.$broadcast('open_marker_popup', roomId);
    };

    $scope.getRoomTypeIcon = function(roomType) {
      if (roomType === 'room') return 'lodging';
      else if (roomType === 'appartment') return 'commercial';
      else return 'building';
    };

    $scope.setRoomType = function(selection) {
      if (selection === 'all') return [];
      else return [selection];
    };

    function closeRoomOverlay() {
      $state.transitionTo('search', $stateParams, { reload: false, location: false });
        
      $scope.selectedRoomId = null;
      $scope.isOverLayOpen = false;
    }

    function showRoomOverlay() {

      console.log($stateParams);
      //$location.path('/rooms/' + $scope.selectedRoomId);
      $state.transitionTo('search.overlay', $stateParams, { reload: false, location: false });
      $scope.$broadcast('close_marker_popups');
      

      $scope.isOverLayOpen = true;
    }

    $scope.searchFunction = $window._.debounce($scope.fetchRooms, 400);
	}
]);