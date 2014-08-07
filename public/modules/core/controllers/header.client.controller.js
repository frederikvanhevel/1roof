'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$location', '$modal', '$http', '$interval', 'Authentication', 'Menus', 'Geocoder', 'Modal', 'gettextCatalog', 'Socket',
	function($scope, $location,  $modal, $http, $interval, Authentication, Menus, Geocoder, Modal, gettextCatalog, Socket) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
    $scope.search = '';
    $scope.searchDetails = {};
    $scope.unreadMessageCount = 0;
    $scope.messagesPopoverVisible = false;

    $scope.init = function() {
      var language = window.navigator.userLanguage || window.navigator.language;

      if (language.indexOf('nl') !== -1) $scope.setLanguage('nl');

      // poll for messages every 30 seconds
      //$interval($scope.getUnreadMessageCount, 30000);
      //Socket.on('newMessages', function(count) {
      //  $scope.unreadMessageCount = count;
      //});
    };

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
        // TODO: interval for checking for new messages - or socket.io
        $http({ method: 'GET', url: '/users/unreadmessages'}).then(function(result) {
            $scope.unreadMessageCount = result.data;
        });
      }
    };

    $scope.setLanguage = function(language) {
      gettextCatalog.currentLanguage = language;
      gettextCatalog.debug = true;
    };
	}
]);