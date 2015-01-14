'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users'),
        ads = require('../../app/controllers/ads');

    // Inbox Routes
    app.route('/api/ad')
        .post(users.requiresLogin, ads.create)
        .get(users.requiresLogin, ads.list);

    app.route('/api/ad/:adId')
        .get(ads.read)
        .put(users.requiresLogin, ads.hasAuthorization, ads.update)
        .delete(users.requiresLogin, ads.hasAuthorization, ads.delete);

    // Finish by binding the Inbox middleware
    app.param('adId', ads.adByID);
};
