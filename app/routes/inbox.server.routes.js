'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users');
  var inbox = require('../../app/controllers/inbox');

  // Inbox Routes
  app.route('/inbox')
    .get(users.requiresLogin, inbox.list);
  
  app.route('/inbox/:inboxId')
    .get(inbox.read)
    .put(users.requiresLogin, inbox.hasAuthorization, inbox.update)
    .delete(users.requiresLogin, inbox.hasAuthorization, inbox.delete);

  app.route('/inbox/:inboxId/sendmessage')
    .post(users.requiresLogin, inbox.hasAuthorization, inbox.sendMessage);

  // Finish by binding the Inbox middleware
  app.param('inboxId', inbox.inboxByID);
};