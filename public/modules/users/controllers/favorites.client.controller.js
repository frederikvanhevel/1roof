'use strict';

angular.module('users').controller('FavoritesController', ['$scope', '$http', '$stateParams', 'Authentication', 'Meta',
    function($scope, $http, $stateParams, Authentication, Meta) {
        $scope.authentication = Authentication;
        $scope.favorites = [];

        $scope.busy = false;

        $scope.init = function() {
            $http.get('/api/users/' + $stateParams.userId).success(function(response) {
                $scope.user = response;

                Meta.add('/l/:roomId/:city/:title', { 
                    title: 'Wishlist van ' + $scope.user.displayName
                });

                getUserFavorites();
            });
        };


        function getUserFavorites() {
            $http.get('/api/users/' + $scope.user._id + '/favorites').success(function(response) {
                $scope.favorites = response;
                $scope.busy = false;

                $scope.htmlReady(); 
            }).error(function(response) {
                $scope.busy = false;

                $scope.htmlReady(); 
            });
        }

    }
]);
