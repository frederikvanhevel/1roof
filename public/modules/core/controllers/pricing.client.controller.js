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
        if (Authentication.user && !Authentication.user.customerToken) Modal.payment();
        else saveSubscription(plan);
      });
    };

    $scope.submitPayment = function(status, response) {
      if(response.error) {
        // there was an error. Fix it.
        console.log(response.error);
      } else {
        // got stripe token, now charge it or smt
        console.log(response.id);
        saveSubscription(response.id, $scope.plan);
      }
    };

    $scope.isCurrentPlan = function(plan) {
      if (Authentication.user) return Authentication.user.subscriptionPlan === plan;
      else return false;
    };

    function saveSubscription(plan, card) {
      $http.post('/subscription/choose', { plan: plan, card: card }).success(function(response) {
        Alert.add('success', 'Je tariefplan is geupdate!', 5000);
      }).error(function(response) {
        Alert.add('danger', 'Er is iets misgelopen met het updaten van je tariefplan, probeer later opnieuw.', 5000);
      });
    }

}]);