'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', '$stateParams', 'Users', 'Authentication', 'gettext', 'Modal',
    function($scope, $http, $location, $stateParams, Users, Authentication, gettext, Modal) {
        $scope.user = Authentication.user;
        $scope.busy = false;
        $scope.nav = 'info';

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/signin');

        // Check if there are additional accounts
        $scope.hasConnectedAdditionalSocialAccounts = function(provider) {
            for (var i in $scope.user.additionalProvidersData) {
                return true;
            }

            return false;
        };

        // Check if provider is already in use with current user
        $scope.isConnectedSocialAccount = function(provider) {
            return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
        };

        // Remove a user social account
        $scope.removeUserSocialAccount = function(provider) {
            $scope.success = $scope.error = null;

            $http.delete('/api/users/accounts', {
                params: {
                    provider: provider
                }
            }).success(function(response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.user = Authentication.user = response;
                flashSavedText();
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        // Update a user profile
        $scope.updateUserProfile = function() {
            $scope.success = $scope.error = null;
            var user = new Users($scope.user);

            user.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                flashSavedText();
            }, function(response) {
                $scope.error = response.data.message;
            });
        };

        // Change user password
        $scope.changeUserPassword = function() {
            $scope.success = $scope.error = null;

            $http.post('/api/users/password', $scope.passwordDetails).success(function(response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.passwordDetails = null;
                flashSavedText();
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.getSubscription = function() {
            // TODO: request this from the API
            var plan = Authentication.user.subscription.plan;

            if (plan === 'FREE') return gettext('Student');
            else if (plan === 'PRO') return gettext('Huisbaas');
            else if (plan === 'BUSINESS') return gettext('Agentschap');
        };

        $scope.removeAccount = function() {
            Modal.confirm('account').then(function() {
                var user = new Users($scope.user);

                user.$remove(function() {
                    $location.path('/');
                });
            });
        };

        function flashSavedText() {
            $scope.$broadcast('blink_text');
        }
    }
]);
