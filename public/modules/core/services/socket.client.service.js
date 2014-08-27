'use strict';

angular.module('core').factory('Socket', [ '$window', 'socketFactory',
  function($window, socketFactory) {

    var host = location.protocol + '//' + window.location.hostname + ':3001';
    var ioSocket = $window.io.connect(host);

    return socketFactory({
      ioSocket: ioSocket
    });

  }
]);