'use strict';

angular.module('core').controller('HeaderController', ['$rootScope', '$scope', '$stateParams', '$location', '$modal', '$http', '$interval', 'Authentication', 'Geocoder', 'Modal', 'gettextCatalog', 'Socket', 'amMoment', '$state', 'Analytics',
    function($rootScope, $scope, $stateParams, $location, $modal, $http, $interval, Authentication, Geocoder, Modal, gettextCatalog, Socket, amMoment, $state, Analytics) {
        $scope.authentication = Authentication;

        $scope.isCollapsed = true;
        $scope.unreadMessageCount = 0;

        $scope.search = {
            input: '',
            details: {},
            autocompleteOptions: { types: '(cities)', country: 'be' }
        };
        
        $scope.init = function() {
            $scope.isHomepage = document.location.pathname === '/';

            $rootScope.language = 'nl';
            setLanguage('nl', false);

            // detect browser language
            // $rootScope.language = (window.navigator.userLanguage || window.navigator.language).split('-')[0];
            // if ($rootScope.language.indexOf('nl') !== -1) setLanguage('nl', false);
            // else setLanguage('en', true);
            // watch for language changes
            $rootScope.$watch('language', function(newVal, oldVal) {
                if (newVal !== oldVal) setLanguage(newVal, true);
            });

            // always close the menu after navigating
            $rootScope.$on('$locationChangeSuccess', function() {
                $scope.isCollapsed = true;
                $scope.isHomepage = document.location.pathname === '/';
            });
            // re-initialize sockets on log in
            $rootScope.$on('logged_in', function() {
                initializeSocket();
            });

            initializeSocket();
        };

        $scope.toggleCollapsibleMenu = function() {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        $scope.goToSearch = function() {
            if ($scope.search.details.geometry) {
                changeLocation(
                    $scope.search.input.replace(/, /g, '--'),
                    $scope.search.details.geometry.location.lat(),
                    $scope.search.details.geometry.location.lng()
                );
            } else {
                Geocoder.geocodeAddress($scope.search.input).then(function(result) {
                    changeLocation(result.formattedAddress.replace(/, /g, '--'), result.lat, result.lng);
                });
            }
            $scope.search.input = '';
            $scope.search.details = {};
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
                    if (!$stateParams.inboxId || $stateParams.inboxId !== response.inbox) {
                        $scope.unreadMessageCount = +$scope.unreadMessageCount + response.count;
                        if ( $scope.unreadMessageCount < 0)  $scope.unreadMessageCount = 0;

                        playNewMessageSound();
                    }
                });

                $rootScope.$on('inbox_read', function(event, count) {
                    if (count > 0) $scope.unreadMessageCount -= count;
                });
            }
        }

        function playNewMessageSound() {
            var audio = new Audio('/modules/core/img/woosh.wav');
            audio.play();
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
            amMoment.changeLocale(language);

            if (reload)
                $state.reload();
        }
    }
]);
