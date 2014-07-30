'use strict';

angular.module('users').controller('InboxController', ['$scope', '$location', '$http', '$stateParams', 'Inbox', 'Authentication',
	function($scope, $location, $http, $stateParams, Inbox, Authentication) {
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
      if (!$scope.newMessage || $scope.newMessage === '') return;

      $scope.busy = true;

      $http.post('/inbox/' + $scope.inbox._id + '/sendmessage', { message: $scope.newMessage }).success(function(response) {
          $scope.busy = false;
          $scope.newMessage = '';
          $scope.inbox = response;
      }).error(function(response) {
          $scope.busy = false;
      });
    };

    $scope.isMessageOwner = function(message) {
      return message.sender === Authentication.user._id;
    };

    $scope.showInbox = function(inboxId) {
      $scope.findOne(inboxId);
      $location.path('dashboard/messages/' + inboxId);
    };

    $scope.getUserPicture = function(inbox) {
      var user = inbox.sender._id === Authentication.user._id ? inbox.roomOwner : inbox.sender;

      var pictureSrc = '';

      if (user.provider === 'local')
        pictureSrc = '/modules/core/img/default-user-icon.png';
      else if (user.provider === 'google')
        pictureSrc = user.providerData.picture;
      else if (user.provider === 'facebook')
        pictureSrc = user.providerData.picture;

      return { 'background-image': 'url(' + pictureSrc + ')' };
    };
	}
]);