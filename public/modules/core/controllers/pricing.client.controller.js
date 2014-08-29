'use strict';

angular.module('core').controller('PricingController', ['$scope', '$location', '$stateParams', 'Authentication', 'Alert', 'Meta', '$http', 'Modal', 'Enforcer',
  function ($scope, $location, $stateParams, Authentication, Alert, Meta, $http, Modal, Enforcer) {
    $scope.authentication = Authentication;

    $scope.busy = false;
    $scope.couponCode = null;

    Meta.setTitle('Upgraden');

    $scope.init = function() {
      $scope.upgrade = $stateParams.upgrade;

      // TODO: use coupon code in query parameter
    };

    $scope.choosePlan = function(plan) {
      $scope.busy = true;

      Enforcer.do(function() {
        if (Authentication.user && !Authentication.user.customerToken) {
          Modal.payment({ plan: plan, couponCode: $scope.couponCode }).then(function(response) {
            Authentication.user = response;
            Alert.add('success', 'Je tariefplan is geupdatet!', 5000);
            $scope.busy = false;
          }, function(result) {
            if (result.error) {
              Alert.add('danger', 'CHOOSE Er is iets misgelopen met het updaten van je tariefplan, probeer later opnieuw.', 5000);
            }
            $scope.busy = false;
          });
        }
        else {
          saveSubscription(plan, $scope.couponCode);
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
      $http.post('/subscription/choose', { plan: plan, couponCode: couponCode }).success(function(response) {
        Authentication.user = response;
        Alert.add('success', 'Je tariefplan is geupdatet!', 5000);
        $scope.busy = false;
      }).error(function() {
        Alert.add('danger', 'SAVE Er is iets misgelopen met het updaten van je tariefplan, probeer later opnieuw.', 5000);
        $scope.busy = false;
      });
    }

}]);