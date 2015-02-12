'use strict';

var config = require('../../config/config'),
    winston = require('winston'),
    Twitter = require('twit'),
    http = require('http');

var twitterClient = new Twitter({
    consumer_key: config.twitter.clientID,
    consumer_secret: config.twitter.clientSecret,
    access_token: config.twitter.accesstoken,
    access_token_secret: config.twitter.accesstokenSecret
});

function getImageLink(picture) {
    var url = '';

    if (picture.provider === 'cloudinary')
        url = 'https://res.cloudinary.com/dv8yfamzc/image/upload/' + picture.link + '.png';
    else url = picture.link;

    return url;
}

exports.postToFeed = function(room) {

    twitterClient.post('statuses/update', { status: room.info.title + ' https://1roof.be' + room.url }, function(err, data, response) {
        if (err) {
            winston.error('Error posting to twitter feed', err);
        } else {
            winston.info('Successfully posted to twitter timeline');
        }
    });

};
