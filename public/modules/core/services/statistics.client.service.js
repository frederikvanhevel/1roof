'use strict';

angular.module('core').service('Statistics', [ '$http', 'localStorageService',
  function($http, localStorageService) {
    
    this.aggregate = function(roomId){
      var seenRooms = localStorageService.get('viewedRooms') || [];
      if (seenRooms.indexOf(roomId) === -1) {
          postAggregation(roomId);
          seenRooms.push(roomId);
      }
      localStorageService.set('viewedRooms', seenRooms);
    };

    function postAggregation(roomId){
      $http.post('/statistics/' + roomId + '/aggregate');
    }

  }
]);