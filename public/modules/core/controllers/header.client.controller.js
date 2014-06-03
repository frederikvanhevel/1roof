'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$location', '$modal', '$http', 'Authentication', 'Menus', 'Geocoder', 'Modal',
	function($scope, $location,  $modal, $http, Authentication, Menus, Geocoder, Modal) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
    $scope.search = '';
    $scope.searchDetails = {};
    $scope.unreadMessageCount = 0;

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

    $scope.goToSearch = function() {
      if ($scope.searchDetails.geometry) {
        $location.path('search/' + $scope.search.replace(/, /g, '--'))
          .search('lat', $scope.searchDetails.geometry.location.lat())
          .search('lng', $scope.searchDetails.geometry.location.lng());
      } else {
        Geocoder.geocodeAddress($scope.search).then(function(result) {
          $location.path('search/' + result.formattedAddress.replace(/, /g, '--'))
            .search('lat', result.lat)
            .search('lng', result.lng);
        });
      }
      $scope.searchDetails = {};
    };

    $scope.openSignupModal = function() {
      Modal.signup();
    };

    $scope.openSigninModal = function() {
      Modal.signin();
    };

    $scope.getUnreadMessageCount = function() {
      if (Authentication.user) {
        // TODO: interval for checking for new messages
        $http({ method: 'GET', url: '/users/unreadmessages'})
          .then(function(result) {
            $scope.unreadMessageCount = result.data;
          });
      }
    };
	}
]);