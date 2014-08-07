'use strict';

angular.module('core').factory('Socket', [ '$window', 'socketFactory',
  function($window, socketFactory) {
    //return socketFactory();

    var ioSocket = $window.io.connect('http://localhost:3001');

    return socketFactory({
      ioSocket: ioSocket
    });

  }
]);