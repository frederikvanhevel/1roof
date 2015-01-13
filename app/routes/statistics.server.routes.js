'use strict';

module.exports = function(app) {
  var rooms = require('../../app/controllers/rooms'),
      users = require('../../app/controllers/users'),
      statistics = require('../../app/controllers/statistics');

  // Statistics Routes
  app.route('/api/statistics/:roomId/aggregate')
    .post(statistics.aggregate);

  app.route('/api/statistics/:roomId/lastmonth')
    .get(users.requiresLogin, statistics.lastMonth);

  // Finish by binding the Inbox middleware
  app.param('roomId', rooms.roomByID);
};
