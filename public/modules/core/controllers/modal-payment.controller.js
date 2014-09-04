'use strict';

// Rooms controller
angular.module('rooms').controller('ModalPaymentController', ['$rootScope', '$scope', '$http', '$modalInstance', 'options', 'Alert',
    function($rootScope, $scope, $http, $modalInstance, options, Alert) {
        $scope.subscriptionPlan = options.plan;

        $scope.busy = false;

        $scope.submitPayment = function(status, response) {
            $scope.busy = true;

            if (response.error) {
                // there was an error
                $scope.busy = false;
                Alert.add('danger', 'Er is iets misgelopen met het updaten van je tariefplan, probeer later opnieuw.', 5000);
            } else {
                // got stripe token, now charge it
                saveSubscription(options.plan, response.id, options.couponCode);
            }
        };

        function saveSubscription(plan, card, couponCode) {
            $http.post('/subscription/choose', {
                plan: plan,
                card: card,
                couponCode: couponCode
            }).success(function(response) {
                $modalInstance.close(response);
                $scope.busy = false;
            }).error(function(response) {
                $scope.busy = false;
                $modalInstance.dismiss({
                    error: true
                });
            });
        }

    }
]);
