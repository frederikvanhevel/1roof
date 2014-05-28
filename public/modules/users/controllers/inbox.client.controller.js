'use strict';

angular.module('users').controller('InboxController', ['$scope', '$stateParams', 'Inbox', 'Authentication',
	function($scope, $stateParams, Inbox, Authentication) {
    $scope.authentication = Authentication;
    $scope.newMessage = '';
    $scope.busy = false;

    $scope.list = function() {
      $scope.inboxes = Inbox.query();
    };

    // Find existing Room
    $scope.findOne = function() {
      $scope.inboxes = Inbox.query();
      $scope.inbox = Inbox.get({
          inboxId: $stateParams.inboxId
      });
    };

    $scope.sendMessage = function() {
      $scope.busy = true;
      $scope.inbox.$sendMessage({
        message:  $scope.newMessage
      }, function() {
        $scope.busy = false;
        $scope.newMessage = '';
      });
    };
	}
]);