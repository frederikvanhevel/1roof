'use strict';

angular.module('core').controller('HeaderController', ['$rootScope', '$scope', '$stateParams', '$location', '$modal', '$http', '$interval', 'Authentication', 'Menus', 'Geocoder', 'Modal', 'gettextCatalog', 'Socket', 'amMoment', '$state', 'Analytics',
    function($rootScope, $scope, $stateParams, $location, $modal, $http, $interval, Authentication, Menus, Geocoder, Modal, gettextCatalog, Socket, amMoment, $state, Analytics) {
        $scope.authentication = Authentication;
        $scope.isCollapsed = true;
        $scope.search = '';
        $scope.searchDetails = {};
        $scope.unreadMessageCount = 0;

        $scope.init = function() {

            // detect browser language
            $rootScope.language = window.navigator.userLanguage || window.navigator.language;
            if ($rootScope.language.indexOf('nl') !== -1) setLanguage('nl', false);

            // watch for language changes
            $rootScope.$watch('language', function(newVal, oldVal) {
                if (newVal !== oldVal) setLanguage(newVal, true);
            });
            // always close the menu after navigating
            $rootScope.$on('$locationChangeSuccess', function() {
                $scope.isCollapsed = true;
            });
            // re-initialize sockets on log in
            $rootScope.$on('logged_in', function() {
                initializeSocket();
            });

            initializeSocket();

            Analytics.initialize();
        };

        $scope.toggleCollapsibleMenu = function() {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        $scope.goToSearch = function() {
            if ($scope.searchDetails.geometry) {
                changeLocation($scope.search.replace(/, /g, '--'), $scope.searchDetails.geometry.location.lat(), $scope.searchDetails.geometry.location.lng());
            } else {
                Geocoder.geocodeAddress($scope.search).then(function(result) {
                    changeLocation(result.formattedAddress.replace(/, /g, '--'), result.lat, result.lng);
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
                $http({
                    method: 'GET',
                    url: '/api/users/unreadmessages'
                }).then(function(result) {
                    $scope.unreadMessageCount = result.data;
                });
            }
        };

        function initializeSocket() {
            // subscribe to new messages
            if (Authentication.user) {
                Socket.emit('join', Authentication.user._id);
                Socket.on('newMessageCount', function(response) {
                    if (!$stateParams.inboxId || $stateParams.inboxId !== response.inbox)
                        $scope.unreadMessageCount = +$scope.unreadMessageCount + response.count;
                });

                $rootScope.$on('inbox_read', function(event, count) {
                    if (count > 0) $scope.unreadMessageCount -= count;
                });
            }
        }

        function changeLocation(address, lat, lng) {
            $location.path('/search/' + address)
                .search('lat', lat)
                .search('lng', lng);
        }

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
