'use strict';

angular.module('core').controller('PricingController', ['$scope', '$location', '$stateParams', 'Authentication', 'Alert', 'Meta', '$http', 'Modal', 'Enforcer',
  function ($scope, $location, $stateParams, Authentication, Alert, Meta, $http, Modal, Enforcer) {
    $scope.authentication = Authentication;

    Meta.setTitle('Upgraden');

    $scope.init = function() {
      $scope.upgrade = $stateParams.upgrade;
    };

    $scope.choosePlan = function(plan) {
      Enforcer.do(function() {
        if (Authentication.user && !Authentication.user.customerToken) {
          Modal.payment(plan).then(function(response) {
            Authentication.user = response;
            Alert.add('success', 'Je tariefplan is geupdatet!', 5000);
          }, function(result) {
            if (result.error) {
              Alert.add('danger', 'CHOOSE Er is iets misgelopen met het updaten van je tariefplan, probeer later opnieuw.', 5000);
            }
          });
        }
        else {
          saveSubscription(plan);
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

    function saveSubscription(plan, card) {
      $http.post('/subscription/choose', { plan: plan, card: card }).success(function(response) {
        Authentication.user = response;
        Alert.add('success', 'Je tariefplan is geupdatet!', 5000);
      }).error(function() {
        Alert.add('danger', 'SAVE Er is iets misgelopen met het updaten van je tariefplan, probeer later opnieuw.', 5000);
      });
    }

}]);