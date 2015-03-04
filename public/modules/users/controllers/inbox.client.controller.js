'use strict';

angular.module('users').controller('InboxController', ['$rootScope', '$scope', '$location', '$http', '$stateParams', 'Inbox', 'Authentication', 'Socket', 'Modal', 'Alert', 'gettext',
    function($rootScope, $scope, $location, $http, $stateParams, Inbox, Authentication, Socket, Modal, Alert, gettext) {
        $scope.authentication = Authentication;
        $scope.newMessage = '';
        $scope.busy = false;

        function getCurrentUser() {
            if (!Authentication.user) $location.path('/signin');
            return Authentication.user;
        }

        $scope.init = function() {
            // If user is not signed in then redirect back home
            if (!getCurrentUser()) $location.path('/signin');

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
                if (message.sender !== getCurrentUser()._id) {
                    $scope.inbox.messages.push(message);
                    // playNewMessageSound();
                }
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

            }, function() {
                Alert.add('danger', gettext('Er is iets misgelopen met het laden van deze inbox. Probeer later opniew.'), 5000);
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
                $scope.inbox.messages.push(response);
            }).error(function(response) {
                Alert.add('danger', gettext('Er is iets misgelopen met het verzenden van je berucht. Probeer later opniew.'), 5000);
                $scope.busy = false;
            });
        };

        $scope.isMessageOwner = function(message) {
            return message.sender === getCurrentUser()._id;
        };

        $scope.showInbox = function(inboxId) {
            $scope.findOne(inboxId);

            $location.path('/dashboard/messages/' + inboxId);
        };

        $scope.getUserPicture = function(inbox) {
            var user = inbox.sender._id === getCurrentUser()._id ? inbox.roomOwner : inbox.sender;

            var pictureSrc = '';

            if (user && user.provider === 'google')
                pictureSrc = user.providerData.image.url || user.providerData.picture || '/modules/core/img/default-user-icon.png';
            else if (user && user.provider === 'facebook')
                pictureSrc = 'https://graph.facebook.com/' + user.providerData.id + '/picture?type=normal';
            else pictureSrc = '/modules/core/img/default-user-icon.png';

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
                if (message.sender !== getCurrentUser()._id && !message.isRead) count++;
            }
            return count;
        };

        $scope.deleteInbox = function(inbox, $index, $event) {
            Modal.confirm('inbox').then(function() {
                inbox.$remove(function() {
                    $scope.inboxes.splice($index, 1);
                }, function() {
                    Alert.add('danger', gettext('Er is iets misgelopen met het verwijderen van deze inbox. Probeer later opniew.'), 5000);
                });
            });
            $event.preventDefault();
        };

        function setInboxAsRead(inbox) {
            inbox.messages.forEach(function(message) {
                if (message.sender !== getCurrentUser()._id) message.isRead = true;
            });
            inbox.$update();
        }

        function playNewMessageSound() {
            var audio = new Audio('/modules/core/img/woosh.wav');
            audio.play();
        }

    }
]);
