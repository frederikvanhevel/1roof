'use strict';

angular.module('users').controller('InboxController', ['$rootScope', '$scope', '$location', '$http', '$stateParams', 'Inbox', 'Authentication', 'Socket', 'Modal',
    function($rootScope, $scope, $location, $http, $stateParams, Inbox, Authentication, Socket, Modal) {
        $scope.authentication = Authentication;
        $scope.newMessage = '';
        $scope.busy = false;

        // If user is not signed in then redirect back home
        if (!Authentication.user) $location.path('/');

        $scope.init = function() {
            $scope.findOne($stateParams.inboxId);

            // subscribe to this inbox session
            $scope.inbox.$promise.then(function(inbox) {
                Socket.emit('join', inbox._id);
            });

            // leave this inbox session
            $scope.$on('$destroy', function() {
                Socket.emit('leave', $scope.inbox._id);
            });

            // instantly recieve new messages
            Socket.on('newMessage', function(message) {
                $scope.inbox.messages.push(message);
                // playNewMessageSound();
            });
        };

        $scope.list = function() {
            $scope.inboxes = Inbox.query();
        };

        // Find existing Inbox
        $scope.findOne = function(inboxId) {
            $scope.inboxes = Inbox.query();
            $scope.inbox = Inbox.get({
                inboxId: inboxId
            }, function(inbox) {
                var unreadMessageCount = $scope.unreadMessages(inbox);
                if (unreadMessageCount > 0) {
                    setInboxAsRead(inbox);

                    $rootScope.$broadcast('inbox_read', unreadMessageCount);
                }

            });
        };

        $scope.sendMessage = function() {
            if (!$scope.newMessage || $scope.newMessage === '') return;

            $scope.busy = true;

            $http.post('/api/inbox/' + $scope.inbox._id + '/sendmessage', {
                message: $scope.newMessage
            }).success(function(response) {
                $scope.busy = false;
                $scope.newMessage = '';
                // $scope.inbox.messages.push(response);
            }).error(function(response) {
                $scope.busy = false;
            });
        };

        $scope.isMessageOwner = function(message) {
            return message.sender === Authentication.user._id;
        };

        $scope.showInbox = function(inboxId) {
            $scope.findOne(inboxId);

            $location.path('/dashboard/messages/' + inboxId);
        };

        $scope.getUserPicture = function(inbox) {
            var user = inbox.sender._id === Authentication.user._id ? inbox.roomOwner : inbox.sender;

            var pictureSrc = '';

            if (user.provider === 'local')
                pictureSrc = '/modules/core/img/default-user-icon.png';
            else if (user.provider === 'google')
                pictureSrc = user.providerData.picture;
            else if (user.provider === 'facebook')
                pictureSrc = 'https://graph.facebook.com/' + user.providerData.id + '/picture?type=normal';

            return {
                'background-image': 'url(' + pictureSrc + ')'
            };
        };

        $scope.getLastMessage = function(inbox) {
            return inbox.messages[inbox.messages.length - 1];
        };

        $scope.unreadMessages = function(inbox) {
            var count = 0;
            for (var i = 0; i < inbox.messages.length; i++) {
                var message = inbox.messages[i];
                if (message.sender !== Authentication.user._id && !message.isRead) count++;
            }
            return count;
        };

        $scope.deleteInbox = function(inbox, $index, $event) {
            Modal.confirm('inbox').then(function() {
                inbox.$remove(function() {
                    $scope.inboxes.splice($index, 1);
                });
            });
            $event.preventDefault();
        };

        function setInboxAsRead(inbox) {
            inbox.messages.forEach(function(message) {
                if (message.sender !== Authentication.user._id) message.isRead = true;
            });
            inbox.$update();
        }

        function playNewMessageSound() {
            var audio = new Audio('/modules/core/img/woosh.wav');
            audio.play();
        }

    }
]);
