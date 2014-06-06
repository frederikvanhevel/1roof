'use strict';

angular.module('search').controller('SearchController', ['$scope', '$location', '$stateParams', 'Geocoder', 'Rooms', '$window', 'Amenity', 'Authentication', 'Users',
	function($scope, $location, $stateParams, Geocoder, Rooms, $window, Amenity, Authentication, Users) {
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
    $scope.extraFilterMenuOpen = false;
    $scope.amenities = Amenity.list();
    

    $scope.init = function() {
      var urlParamaters = $location.search();
      if ((!urlParamaters.lat || !urlParamaters.lng) && $stateParams.address) {
        $scope.doSearchLookup($stateParams.address);
      } else if (urlParamaters.lat && urlParamaters.lng) {
        $scope.parseUrlParameters(urlParamaters);
        $scope.mapCenter = $scope.filter.location;
      } else {
        $scope.mapZoom = 9;
      }

      $scope.$watch('filter', function(newValue, oldValue) {
        if (newValue !== oldValue && !$scope.extraFilterMenuOpen) $scope.searchFunction();
      }, true);
    };

    $scope.parseUrlParameters = function(urlParamaters) {
      if (urlParamaters.lat && urlParamaters.lng) $scope.filter.location = [ parseFloat(urlParamaters.lng), parseFloat(urlParamaters.lat) ];
      if (urlParamaters.minPrice) $scope.filter.minPrice = +urlParamaters.price;
      if (urlParamaters.maxPrice) $scope.filter.maxPrice = +urlParamaters.maxPrice;
      if (urlParamaters.roomType) $scope.filter.roomType = urlParamaters.roomType;
      if (urlParamaters.size) $scope.filter.size = +urlParamaters.size;
      if (urlParamaters.amneties) $scope.filter.amneties = urlParamaters.amneties;
      console.log($scope.filter);
    };

    $scope.doSearchLookup = function(address) {
      Geocoder.geocodeAddress(address).then(function(result) {
        //$location.search('lat', result.lat).search('lng', result.lng);
        $scope.mapCenter = [result.lng, result.lat];
        $scope.filter.proximity = result.proximity;
      });
    };

    $scope.mapChangedEvent = function(result) {
      $location.search('lat', result.lat).search('lng', result.lng);
      $scope.filter.location = [result.lng, result.lat];
      $scope.filter.proximity = result.proximity / 2;
      console.log($scope.filter.proximity);
      //if ($scope.fetchOnMapChange) $scope.searchFunction();
      $scope.$apply();
    };

    $scope.fetchRooms = function() {
      Rooms.query($scope.filter, function(result) {
        $scope.results = result;
      });
    };

    $scope.runSearch = function() {
      $scope.fetchRooms();
      $scope.extraFilterMenuOpen = false;
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

    $scope.searchFunction = $window._.debounce($scope.fetchRooms, 400);
	}
]);