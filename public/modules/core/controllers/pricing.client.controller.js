'use strict';

angular.module('core').controller('PricingController', ['$scope', '$location', '$stateParams', 'Authentication', 'Alert', 'Meta', '$http', 'Modal', 'Enforcer', 'Analytics',
    function($scope, $location, $stateParams, Authentication, Alert, Meta, $http, Modal, Enforcer, Analytics) {
        $scope.authentication = Authentication;

        $scope.busy = false;

        var coupon = null;

        Meta.setTitle('Upgraden');

        $scope.init = function() {
            $scope.message = $stateParams.message;
            coupon = $stateParams.coupon;
        };

        $scope.choosePlan = function(plan) {
            $scope.busy = true;

            Enforcer.do(function() {
                if (Authentication.user && !Authentication.user.customerToken) {
                    Modal.payment({
                        plan: plan,
                        couponCode: coupon
                    }).then(function(response) {
                        Authentication.user = response;
                        Alert.add('success', 'Je tariefplan is geupdatet!', 5000);
                        $scope.busy = false;
                    }, function(result) {
                        if (result.error) {
                            Alert.add('danger', 'Er is iets misgelopen met het updaten van je tariefplan, probeer later opnieuw.', 5000);
                        }
                        $scope.busy = false;
                    });
                } else {
                    saveSubscription(plan, coupon);
                }
            });
        };

        $scope.isCurrentPlan = function(plan) {
            if (Authentication.user) return Authentication.user.subscriptionPlan === plan;
            else return false;
        };

        function setCurrentPlan(plan) {
            Authentication.user.subscriptionPlan = plan;
        }

        function saveSubscription(plan, couponCode) {
            $http.post('/api/subscription/choose', {
                plan: plan,
                couponCode: couponCode
            }).success(function(response) {
                Authentication.user = response;
                Alert.add('success', 'Je tariefplan is geupdatet!', 5000);
                $scope.busy = false;

                Analytics.trackEvent('Subscription', 'Changed', plan, couponCode);
            }).error(function() {
                Alert.add('danger', 'Er is iets misgelopen met het updaten van je tariefplan, probeer later opnieuw.', 5000);
                $scope.busy = false;
            });
        }

    }
]);
