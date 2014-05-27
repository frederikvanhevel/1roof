'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users');
  var inbox = require('../../app/controllers/inbox');

  // Inbox Routes
  app.route('/inbox')
    .get(inbox.list);
    //.post(users.requiresLogin, inbox.hasAuthorization, inbox.create);
  
  app.route('/inbox/:inboxId')
    .get(inbox.read)
    .put(users.requiresLogin, inbox.hasAuthorization, inbox.update);
    //.delete(users.requiresLogin, inbox.hasAuthorization, inbox.delete);

  // Finish by binding the Inbox middleware
  app.param('inboxId', inbox.inboxByID);
};