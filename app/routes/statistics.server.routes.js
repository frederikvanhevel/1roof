'use strict';

module.exports = function(app) {
  var rooms = require('../../app/controllers/rooms');
  var statistics = require('../../app/controllers/statistics');

  // Statistics Routes
  app.route('/statistics/:roomId/aggregate')
    .post(statistics.aggregate);

  // Finish by binding the Inbox middleware
  app.param('roomId', rooms.roomByID);
};