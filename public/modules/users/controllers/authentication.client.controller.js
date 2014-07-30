'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', '$q', 'Authentication', 'Modal',
    function($scope, $http, $location, $q, Authentication, Modal) {
        $scope.authentication = Authentication;

        //If user is signed in then redirect back home
        if ($scope.authentication.user) $location.path('/');

        $scope.signup = function(redirectTo) {
            var deferred = $q.defer();

            $http.post('/auth/signup', $scope.credentials).success(function(response) {
                //If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // CLose the modal if there is one
                if ($scope.$close) $scope.$close();
                //And redirect to the index page
                // $location.path(redirectTo || '/');
                deferred.resolve();
                return deferred.promise;
            }).error(function(response) {
                $scope.error = response.message;
                deferred.reject();
                return deferred.promise;
            });
        };

        $scope.signin = function(redirectTo) {
            var deferred = $q.defer();

            $http.post('/auth/signin', $scope.credentials).success(function(response) {
                //If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // CLose the modal if there is one
                if ($scope.$close) $scope.$close();
                //And redirect to the index page
                // $location.path(redirectTo || '/');
                deferred.resolve();
                return deferred.promise;
            }).error(function(response) {
                $scope.error = response.message;
                deferred.reject();
                return deferred.promise;
            });
        };

        $scope.openSignupModal = function() {
            if ($scope.$dismiss) $scope.$dismiss();
            Modal.signup();
        };

        $scope.openSigninModal = function() {
            if ($scope.$dismiss) $scope.$dismiss();
            Modal.signin();
        };
    }
]);