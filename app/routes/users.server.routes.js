'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    core = require('../../app/controllers/core'),
    users = require('../../app/controllers/users'),
    inbox = require('../../app/controllers/inbox'),
    rooms = require('../../app/controllers/rooms'),
    payments = require('../../app/controllers/payments');


module.exports = function(app) {
    // User Routes
    app.route('/api/users/me').get(users.me);
    app.route('/api/users').put(users.update).delete(users.delete);
    app.route('/api/users/password').post(users.changePassword);
    app.route('/api/users/accounts').delete(users.removeOAuthProvider);

    // Setting up the users api
    app.route('/auth/signup').post(users.signup);
    app.route('/auth/signin').post(users.signin);
    app.route('/auth/signout').get(users.signout);

    app.route('/auth/forgot').post(users.forgot);
    app.route('/auth/reset/:token').get(users.resetGet);
    app.route('/auth/reset/:token').post(users.resetPost);

    // Setting the facebook oauth routes
    app.route('/auth/facebook').get(passport.authenticate('facebook', {
        scope: ['email']
    }));
    app.route('/auth/facebook/callback').get(users.oauthCallback('facebook'));

    // Setting the twitter oauth routes
    app.route('/auth/twitter').get(passport.authenticate('twitter'));
    app.route('/auth/twitter/callback').get(users.oauthCallback('twitter'));

    // Setting the google oauth routes
    app.route('/auth/google').get(passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/plus.profile.emails.read'
        ]
    }));
    app.route('/auth/google/callback').get(users.oauthCallback('google'));

    // Setting the linkedin oauth routes
    app.route('/auth/linkedin').get(passport.authenticate('linkedin'));
    app.route('/auth/linkedin/callback').get(users.oauthCallback('linkedin'));

    app.route('/api/users/unreadmessages').get(inbox.getUnreadMessageCount);

    app.route('/api/users/:userId').get(users.read);

    app.route('/api/users/:userId/favorites').get(rooms.getUserFavorites);

    // Finish by binding the user middleware
    app.param('userId', users.userByID);
};
