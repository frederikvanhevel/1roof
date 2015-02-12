'use strict';

var mailer = require('../../app/util/mailer'),
    twitter = require('../../app/util/twitter'),
    facebook = require('../../app/util/facebook'),
    mongoose = require('mongoose'),
    winston = require('winston');


exports.run = function() {

    winston.info('Socialmedia job started ..');

    var Room = mongoose.model('Room');

    var query = {
        'publishedToSocial': { $exists: false },
        'visible': true,
        'isInOrder': true,
        'info.title': { $ne: '' },
        'info.description': { $ne: '' },
        'pictures': { $not: { $size: 0 } }
    };

    Room.find(query, function(err, rooms) {
        if (err) {
            winston.error('Error finding rooms ..');
            return;
        }

        var random = Math.floor(Math.random() * rooms.length) + 0;
        var luckyRoom = rooms[random];

        if (luckyRoom) {
            winston.info('We have a winner!');

            twitter.postToFeed(luckyRoom);
            facebook.postToPage(luckyRoom);

            luckyRoom.publishedToSocial = true;
            luckyRoom.save();
        }
    });

};
