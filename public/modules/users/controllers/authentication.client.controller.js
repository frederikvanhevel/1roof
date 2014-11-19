'use strict';

angular.module('users').controller('AuthenticationController', ['$rootScope', '$scope', '$stateParams', '$http', '$location', '$q', 'Authentication', 'Modal',
    function($rootScope, $scope, $stateParams, $http, $location, $q, Authentication, Modal) {
        $scope.authentication = Authentication;

        $scope.busy = false;
        $scope.success = false;

        //If user is signed in then redirect back home
        if ($scope.authentication.user) $location.path('/');

        $scope.signup = function() {
            var deferred = $q.defer();

            $scope.busy = true;

            $http.post('/auth/signup', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // CLose the modal if there is one
                if ($scope.$close) $scope.$close();

                deferred.resolve();

                $rootScope.$broadcast('logged_in');

                $scope.busy = false;

                return deferred.promise;
            }).error(function(response) {
                $scope.error = response.message;
                deferred.reject();

                $scope.busy = false;

                return deferred.promise;
            });
        };

        $scope.signin = function() {
            var deferred = $q.defer();

            $scope.busy = true;

            $http.post('/auth/signin', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // CLose the modal if there is one
                if ($scope.$close) $scope.$close();

                deferred.resolve();

                $rootScope.$broadcast('logged_in');

                $scope.busy = false;

                return deferred.promise;
            }).error(function(response) {
                $scope.error = response.message;
                deferred.reject();

                $scope.busy = false;

                return deferred.promise;
            });
        };

        $scope.forgot = function() {
            $scope.success = $scope.error = null;

            $scope.busy = true;

            $http.post('/auth/forgot', $scope.credentials).success(function(response) {
                // Show user success message and clear form
                $scope.credentials = null;
                $scope.success = true;

                $scope.busy = false;
            }).error(function(response) {
                // Show user error message and clear form
                $scope.credentials = null;
                $scope.error = response.message;

                $scope.busy = false;
            });
        };

        // Change user password
        $scope.reset = function() {
            $scope.success = $scope.error = null;

            $scope.busy = true;

            $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.passwordDetails = null;

                $scope.busy = false;
            }).error(function(response) {
                $scope.error = response.message;

                $scope.busy = false;
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
