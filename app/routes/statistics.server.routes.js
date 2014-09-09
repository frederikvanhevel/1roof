'use strict';

module.exports = function(app) {
  var rooms = require('../../app/controllers/rooms');
  var users = require('../../app/controllers/users');
  var statistics = require('../../app/controllers/statistics');

  // Statistics Routes
  app.route('/api/statistics/:roomId/aggregate')
    .post(statistics.aggregate);

  app.route('/api/statistics/:roomId/lastmonth')
    .get(users.requiresLogin, users.hasAnalytics, statistics.lastMonth);

  // Finish by binding the Inbox middleware
  app.param('roomId', rooms.roomByID);
};
