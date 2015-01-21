'use strict';

angular.module('search').controller('SearchController', ['$rootScope', '$scope', '$timeout', '$location', '$state', '$stateParams', 'Geocoder', 'Rooms', '$window', 'Authentication', 'localStorageService', 'Enforcer', 'UserSettings',
    function($rootScope, $scope, $timeout, $location, $state, $stateParams, Geocoder, Rooms, $window, Authentication, localStorageService, Enforcer, UserSettings) {
        $scope.user = Authentication.user;

        $scope.mapCenter = [4.3517100, 50.8503400]; // Brussel
        $scope.mapZoom = 13;
        $scope.filter = {
            location: [],
            proximity: 7000,
            roomType: [],
            minPrice: 0,
            maxPrice: 2000,
            size: null,
            amenities: []
        };
        $scope.results = [];

        $scope.selectedRoomId = null;
        $scope.isOverLayOpen = false;
        $scope.busy = false;

        var viewedRooms = localStorageService.get('viewedRooms') || [];
        var oldLocation = null;

        $scope.init = function() {
            var urlParamaters = $location.search();

            function getZoomLevel(m) {
                var z = Math.floor((Math.log(20088000 / m)) / Math.log(2));
                if (z > 19) z = 19;
                if (z < 0) z = 0;
                return z;
            }

            // Fixes empty overlay window when clicking browser back button
            $rootScope.$watch(function() {
                return $location.path();
            }, function(newLocation, oldLocation) {
                if (newLocation.indexOf('/search') !== -1 && oldLocation.indexOf('/l/') !== -1) {
                    $scope.selectedRoomId = null;
                }
            });

            $scope.$watch('filter', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    searchFunction();
                }
            }, true);

            if ((!urlParamaters.lat || !urlParamaters.lng) && $stateParams.address) {
                doSearchLookup($stateParams.address);
            } else if (urlParamaters.lat && urlParamaters.lng) {
                parseUrlParameters(urlParamaters);

                $scope.mapCenter = $scope.filter.location;
                $scope.mapZoom = getZoomLevel($scope.filter.proximity);

                // initial rooms fetch
                fetchRooms();
            } else {
                $scope.mapZoom = 9;

                // initial rooms fetch
                fetchRooms();
            }

            // Show a room if its in the url
            if ($stateParams.roomId) {
                $scope.selectedRoomId = $stateParams.roomId;
                showRoomOverlay();
            }

            // initial filter save (location)
            if ($scope.user && $scope.user.settings.email.newRooms) {
                $scope.updateSettings();
            }

            $rootScope.$on('close_overlay', closeRoomOverlay);
        };

        function parseUrlParameters(urlParamaters) {
            if (urlParamaters.lat && urlParamaters.lng) $scope.filter.location = [parseFloat(urlParamaters.lng), parseFloat(urlParamaters.lat)];
            if (urlParamaters.proximity) $scope.filter.proximity = urlParamaters.proximity;
            if (urlParamaters.minPrice) $scope.filter.minPrice = +urlParamaters.price;
            if (urlParamaters.maxPrice) $scope.filter.maxPrice = +urlParamaters.maxPrice;
            if (urlParamaters.roomType) $scope.filter.roomType = urlParamaters.roomType;
            if (urlParamaters.size) $scope.filter.size = +urlParamaters.size;
            if (urlParamaters.amneties) $scope.filter.amneties = urlParamaters.amneties;
        }

        function doSearchLookup(address) {
            Geocoder.geocodeAddress(address.replace('--', ' ')).then(function(result) {
                $scope.mapCenter = [result.lng, result.lat];
                $scope.filter.location = [result.lng, result.lat];
                // $scope.filter.proximity = result.proximity;
                // should be replaced with accuracy

                if ($location.search()._escaped_fragment_ === '') fetchRooms();    // hack for google crawling
            });
        }

        $scope.mapChangedEvent = function(result) {
            $scope.filter.proximity = result.proximity / 2;
            $scope.filter.location = [result.lng, result.lat];

            $location.search('lat', result.lat).search('lng', result.lng).search('proximity', $scope.filter.proximity);

            // Prevent digest errors
            $timeout(function() {
                $scope.$apply();
            });
        };

        $scope.toggleAmenitySelection = function(amenity) {
            var idx = $scope.filter.amenities.indexOf(amenity);

            if (idx > -1) {
                $scope.filter.amenities.splice(idx, 1);
            } else {
                $scope.filter.amenities.push(amenity);
            }
        };

        $scope.selectRoom = function(roomId, url) {

            if (!$scope.selectedRoomId || $scope.selectedRoomId !== roomId) {
                $scope.selectedRoomId = roomId;

                $window._.extend($stateParams, {
                    roomId: roomId,
                    isOverlay: true
                });

                // remember the url of the search map and set the new url to the room
                var currentUrl = $location.url();
                if (currentUrl.indexOf('/search') !== -1) {
                    oldLocation = $location.url();
                    $location.url(url);
                }

                showRoomOverlay();

                if (viewedRooms.indexOf(roomId) === -1) viewedRooms.push(roomId);

            } else {
                $scope.selectedRoomId = null;

                closeRoomOverlay();
            }
        };

        $scope.hasSeenRoom = function(roomId) {
            return viewedRooms.indexOf(roomId) !== -1;
        };

        $scope.openRoomPopup = function(roomId) {
            $scope.$broadcast('open_marker_popup', roomId);
        };

        $scope.getRoomTypeIcon = function(roomType) {
            if (roomType === 'room') return 'lodging';
            else if (roomType === 'appartment') return 'commercial';
            else return 'building';
        };

        $scope.setRoomType = function(selection) {
            if (selection === 'all') return [];
            else return [selection];
        };

        $scope.isNewRoom = function(room) {
            return (new Date().getTime() - new Date(room.created).getTime()) < 86400000; // one day
        };

        // Update user profile
        $scope.updateSettings = function($event) {
            Enforcer.do(function() {
                UserSettings.set('alert.filters', {
                    location: $scope.filter.location,
                    proximity: $scope.filter.proximity
                });
            }, function() {
                $event.preventDefault();
            });
        };

        function fetchRooms() {
            $scope.busy = true;

            Rooms.query($scope.filter, function(results) {

                // Non-destructively rebuild the array of rooms, otherwise all the markers would
                // be replaced and popups would be closed, confusing the user

                var oldRooms = $scope.results;
                var newRooms = results;

                var oldIds = oldRooms.map(function(room) {
                    return room._id;
                });
                var newIds = newRooms.map(function(room) {
                    return room._id;
                });

                var toDelete = $window._.difference(oldIds, newIds);
                var toAdd = $window._.difference(newIds, oldIds);

                oldRooms = oldRooms.filter(function(room) {
                    return !$window._.contains(toDelete, room._id);
                });

                newRooms.forEach(function(room) {
                    if ($window._.contains(toAdd, room._id)) oldRooms.push(room);
                });

                $scope.results = oldRooms;

                $scope.busy = false;
                $scope.htmlReady();
            }, function() {
                $scope.results = [];

                $scope.busy = false;
                $scope.htmlReady();
            });
        }

        function closeRoomOverlay() {
            $state.transitionTo('search', $stateParams, {
                reload: false,
                location: false
            });

            // restore the original url of the search map
            if (oldLocation) {
                $location.url(oldLocation);
                oldLocation = null;
            }

            $scope.selectedRoomId = null;
            $scope.isOverLayOpen = false;
        }

        function showRoomOverlay() {
            $state.transitionTo('search.overlay', $stateParams, {
                reload: false,
                location: false
            });
            $scope.$broadcast('close_marker_popups');

            $scope.isOverLayOpen = true;
        }

        var searchFunction = $window._.debounce(fetchRooms, 400);

    }
]);
