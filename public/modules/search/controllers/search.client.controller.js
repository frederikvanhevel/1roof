'use strict';

angular.module('search').controller('SearchController', ['$scope', '$location', '$stateParams', 'Geocoder', 'Rooms', '$window',
	function($scope, $location, $stateParams, Geocoder, Rooms, $window) {
    $scope.mapCenter = [4.469936, 50.503887];
    $scope.mapZoom = 9;
    $scope.fetchOnMapChange = true;
		$scope.filter = {
      location: [],
      proximity: 50000,
      roomType: [],
      minPrice: 0,
      maxPrice: 2000,
      size: null,
      amneties: []
    };
    $scope.results = [];
    

    $scope.init = function() {
      var urlParamaters = $location.search();
      if ((!urlParamaters.lat || !urlParamaters.lng) && $stateParams.address) {
        $scope.doSearchLookup($stateParams.address);
      } else {
        $scope.parseUrlParameters(urlParamaters);
        $scope.mapCenter = $scope.filter.location;
      }

      $scope.$watch('filter', function(newValue, oldValue) {
        if (newValue !== oldValue) $scope.searchFunction();
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
      //if ($scope.fetchOnMapChange) $scope.searchFunction();
      $scope.$apply();
    };

    $scope.fetchRooms = function() {
      Rooms.query($scope.filter, function(result) {
        $scope.results = result;
      });
    };

    $scope.searchFunction = $window._.throttle($scope.fetchRooms, 400);
	}
]);