'use strict';

// Rooms controller
angular.module('rooms').controller('ModalPaymentController', [ '$rootScope', '$scope', '$http', '$modalInstance', 'subscriptionPlan', 'Alert',
    function($rootScope, $scope, $http, $modalInstance, subscriptionPlan, Alert) {
      $scope.subscriptionPlan = subscriptionPlan;

      $scope.submitPayment = function(status, response) {
        if(response.error) {
          // there was an error
          Alert.add('danger', 'Er is iets misgelopen met het updaten van je tariefplan, probeer later opnieuw.', 5000);
        } else {
          // got stripe token, now charge it
          saveSubscription(subscriptionPlan, response.id);
        }
      };

      function saveSubscription(plan, card) {
        $http.post('/subscription/choose', { plan: plan, card: card }).success(function(response) {
          $modalInstance.close(response);
        }).error(function(response) {
          $modalInstance.dismiss({ error: true });
        });
      }

    }
]);