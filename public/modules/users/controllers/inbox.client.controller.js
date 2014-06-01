'use strict';

angular.module('users').controller('InboxController', ['$scope', '$location', '$stateParams', 'Inbox', 'Authentication',
	function($scope, $location, $stateParams, Inbox, Authentication) {
    $scope.authentication = Authentication;
    $scope.newMessage = '';
    $scope.busy = false;

    $scope.init = function() {
      $scope.findOne($stateParams.inboxId);
    };

    $scope.list = function() {
      $scope.inboxes = Inbox.query();
    };

    // Find existing Room
    $scope.findOne = function(inboxId) {
      $scope.inboxes = Inbox.query();
      $scope.inbox = Inbox.get({
          inboxId: inboxId
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

    $scope.isMessageOwner = function(message) {
      return message.sender === Authentication.user._id;
    };

    $scope.showInbox = function(inboxId) {
      $scope.findOne(inboxId);
      $location.path('dashboard/messages/' + inboxId);
    };
	}
]);