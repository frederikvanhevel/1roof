'use strict';

angular.module('core').controller('HeaderController', ['$rootScope', '$scope', '$stateParams', '$location', '$modal', '$http', '$interval', 'Authentication', 'Menus', 'Geocoder', 'Modal', 'gettextCatalog', 'Socket', 'amMoment', '$state',
	function($rootScope, $scope, $stateParams, $location,  $modal, $http, $interval, Authentication, Menus, Geocoder, Modal, gettextCatalog, Socket, amMoment, $state) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
    $scope.search = '';
    $scope.searchDetails = {};
    $scope.unreadMessageCount = 0;
    $scope.messagesPopoverVisible = false;

    $scope.init = function() {
      $rootScope.language = window.navigator.userLanguage || window.navigator.language;
      if ($rootScope.language.indexOf('nl') !== -1) setLanguage('nl', false);

      $rootScope.$watch('language', function(newVal, oldVal) {
        if(newVal !== oldVal) setLanguage(newVal, true);
      });

      // subscribe to new messages
      if (Authentication.user) {
        Socket.emit('join', Authentication.user._id);
        Socket.on('newMessageCount', function(response) {
          if (!$stateParams.inboxId || $stateParams.inboxId !== response.inbox)
            $scope.unreadMessageCount = +$scope.unreadMessageCount + response.count;
        });

        $rootScope.$on('inbox_read', function() {
          if ($scope.unreadMessageCount > 0) $scope.unreadMessageCount--;
        });
      }
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

    function setLanguage(language, reload) {
      // TODO: save language in localStorage
      console.log('changing language to %s', language);

      // gettext
      gettextCatalog.setCurrentLanguage(language);
      // gettextCatalog.debug = true;

      // momentjs
      amMoment.changeLanguage(language);

      if (reload)
        $state.reload();
    }
	}
]);