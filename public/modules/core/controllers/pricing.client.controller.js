'use strict';

angular.module('core').controller('PricingController', ['$scope', '$location', '$stateParams', 'Authentication', 'Alert', 'Meta', '$http', 'Modal', 'Enforcer',
  function ($scope, $location, $stateParams, Authentication, Alert, Meta, $http, Modal, Enforcer) {
    $scope.authentication = Authentication;

    $scope.modalInstance = null;

    Meta.setTitle('Upgraden');

    $scope.init = function() {
      $scope.upgrade = $stateParams.upgrade;
    };

    $scope.choosePlan = function(plan) {
      Enforcer.do(function() {
        if (Authentication.user && !Authentication.user.customerToken) {
          $scope.modalInstance = Modal.payment(plan);
        }
        else {
          saveSubscription(plan);
        }
      });
    };

    $scope.submitPayment = function(status, response) {

      if(response.error) {
        // there was an error
        console.log(response.error);
        Alert.add('danger', 'Er is iets misgelopen met het updaten van je tariefplan, probeer later opnieuw.', 5000);
      } else {
        console.log($scope);
        // got stripe token, now charge it
        //saveSubscription('BUSINESS', response.id);
      }
    };

    $scope.isCurrentPlan = function(plan) {
      if (Authentication.user) return Authentication.user.subscriptionPlan === plan;
      else return false;
    };

    function saveSubscription(plan, card) {
      console.log(plan);
      $http.post('/subscription/choose', { plan: plan, card: card }).success(function(response) {
        if ($scope.modalInstance) $scope.modalInstance.$close();
        Alert.add('success', 'Je tariefplan is geupdatet!', 5000);
      }).error(function(response) {
        Alert.add('danger', 'Er is iets misgelopen met het updaten van je tariefplan, probeer later opnieuw.', 5000);
      });
    }

}]);