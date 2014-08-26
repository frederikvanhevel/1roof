'use strict';

angular.module('core').controller('PricingController', ['$scope', '$location', '$stateParams', 'Authentication', 'Alert', 'Meta', '$http', 'Modal',
  function ($scope, $location, $stateParams, Authentication, Alert, Meta, $http, Modal) {
    $scope.authentication = Authentication;

    $scope.plan = 'PRO';

    Meta.setTitle('Upgraden');

    $scope.init = function() {
      $scope.upgrade = $stateParams.upgrade;
    };

    $scope.choosePlan = function() {
      Modal.payment();
    };

    $scope.submitPayment = function(status, response){
      if(response.error) {
        // there was an error. Fix it.
        console.log(response.error);
      } else {
        // got stripe token, now charge it or smt
        console.log(response.id);
        saveSubscription(response.id);
      }
    };

    $scope.isCurrentPlan = function(plan) {
      return Authentication.user.subscriptionPlan === plan;
    };

    function saveSubscription(card) {
      $http.post('/subscription/choose', { card: card, plan: $scope.plan }).success(function(response) {
        Alert.add('success', 'Je tariefplan is geupdate!', 5000);
      }).error(function(response) {
        Alert.add('danger', 'Er is iets misgelopen met het updaten van je tariefplan, probeer later opnieuw.', 5000);
      });
    }

}]);