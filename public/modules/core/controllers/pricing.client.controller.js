'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Alert', 'Meta', '$http',
  function ($scope, Authentication, Alert, Meta, $http) {
    $scope.authentication = Authentication;

    Meta.setTitle('Upgraden');

    $scope.choosePlan = function(plan) {
      $http.post('/subscription/choose', { plan: plan }).success(function(response) {
        Alert.add('success', 'Je tariefplan is geupdate!', 5000);
      }).error(function(response) {
        Alert.add('danger', 'Er is iets misgelopen met het updaten van je tariefplan, probeer later opnieuw.', 5000);
      });
    };

}]);