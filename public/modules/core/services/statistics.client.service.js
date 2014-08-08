'use strict';

angular.module('core').service('Statistics', [ '$http', 'localStorageService',
  function($http, localStorageService) {

    var uniqueViews = false;
    
    this.aggregate = function(roomId) {
      if (uniqueViews) {
        var seenRooms = localStorageService.get('viewedRooms') || [];
        if (seenRooms.indexOf(roomId) === -1) {
          postAggregation(roomId);
          seenRooms.push(roomId);
        }
        localStorageService.set('viewedRooms', seenRooms);
      } else {
        postAggregation(roomId);
      }
    };

    function postAggregation(roomId) {
      $http.post('/statistics/' + roomId + '/aggregate');
    }

  }
]);