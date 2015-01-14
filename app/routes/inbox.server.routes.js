'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users'),
        inbox = require('../../app/controllers/inbox');

    // Inbox Routes
    app.route('/api/inbox')
        .post(users.requiresLogin, inbox.create)
        .get(users.requiresLogin, inbox.list);

    app.route('/api/inbox/:inboxId')
        .get(inbox.read)
        .put(users.requiresLogin, inbox.hasAuthorization, inbox.update)
        .delete(users.requiresLogin, inbox.hasAuthorization, inbox.delete);

    app.route('/api/inbox/:inboxId/sendmessage')
        .post(users.requiresLogin, inbox.hasAuthorization, inbox.sendMessage);

    // Finish by binding the Inbox middleware
    app.param('inboxId', inbox.inboxByID);
};
