'use strict';

angular.module('core').controller('PricingController', ['$scope', '$location', '$stateParams', 'Authentication', 'Alert', '$http', 'Modal', 'Enforcer', 'Analytics', 'gettext',
    function($scope, $location, $stateParams, Authentication, Alert, $http, Modal, Enforcer, Analytics, gettext) {
        $scope.authentication = Authentication;

        $scope.busy = false;

        var coupon = null;

        $scope.init = function() {
            $scope.message = $stateParams.message;
            coupon = $stateParams.coupon;
        };

        $scope.choosePlan = function(plan) {
            $scope.busy = true;

            Enforcer.do(function() {
                if (Authentication.user && !Authentication.user.subscription.customerToken) {
                    Modal.payment({
                        plan: plan,
                        couponCode: coupon
                    }).then(function(response) {
                        Authentication.user = response;
                        Alert.add('success', gettext('Je tariefplan is geupdatet!'), 5000);
                        $scope.busy = false;
                    }, function(result) {
                        if (result && result.error) {
                            Alert.add('danger', gettext('Er is iets misgelopen met het updaten van je tariefplan, probeer later opnieuw.'), 5000);
                        }
                        $scope.busy = false;
                    });
                } else {
                    saveSubscription(plan, coupon);
                }
            });
        };

        $scope.isCurrentPlan = function(plan) {
            if (Authentication.user) return Authentication.user.subscription.plan === plan;
            else return false;
        };

        function setCurrentPlan(plan) {
            Authentication.user.subscription.plan = plan;
        }

        function saveSubscription(plan, couponCode) {
            $http.post('/api/subscription/choose', {
                plan: plan,
                couponCode: couponCode
            }).success(function(response) {
                Authentication.user = response;
                Alert.add('success', gettext('Je tariefplan is geupdatet!'), 5000);
                $scope.busy = false;

                Analytics.trackEvent('Subscription', 'Changed', plan, couponCode);
            }).error(function() {
                Alert.add('danger', gettext('Er is iets misgelopen met het updaten van je tariefplan, probeer later opnieuw.'), 5000);
                $scope.busy = false;
            });
        }

    }
]);
