'use strict';

/*

How to get a token (config.facebook.longToken)
----------------------------------------------

60 minute token: go to graph api explorer, get access_token, goto /me/accounts and get token for 1roof app

You can extend that token for 60 days
https://graph.facebook.com/oauth/access_token?client_id=386807111487438&client_secret=4c7494f271d850cfb8a6627a4284404b&grant_type=fb_exchange_token&fb_exchange_token=old_token

See https://developers.facebook.com/docs/facebook-login/access-tokens?locale=nl_NL#extending
*/

var config = require('../../config/config'),
    winston = require('winston'),
    FB = require('fb');



function limitText(text) {
    var LIMIT_TO = 1000;

    text = text.replace(/(?:\r\n|\r|\n)/g, ' ');
    if (text.length > LIMIT_TO) return text.substring(0, LIMIT_TO) + '...';
    else return text;
}

function isViableForFacebookPost(room) {
    return  !room.publishedToSocial &&
            room.visible &&
            room.isInOrder &&
            room.info.title !== '' &&
            room.info.description !== '' &&
            room.pictures.length > 0;
}

function getImageLink(picture) {
    var url = '';

    if (picture.provider === 'cloudinary')
        url = 'https://res.cloudinary.com/dv8yfamzc/image/upload/' + picture.link + '.png';
    else url = picture.link;

    return url;
}

exports.postToPage = function(room) {

    if (!isViableForFacebookPost(room)) return;

    FB.setAccessToken(config.facebook.accessToken);

    FB.api(
        '/' + config.facebook.pageID + '/photos',
        'POST',
        {
            'message': room.info.title + '\r\n\r\n\r\n\r\n'  + room.info.description + '\r\n\r\n\r\n\r\n https://1roof.be' + room.url,
            'url': getImageLink(room.pictures[0])
        },
        function (response) {
            if (response.error) {
                winston.error('Facebook error', response.error);
            } else {
                winston.info('Successfully posted to facebook wall');
            }
        }
    );

};

exports.extendToken = function() {
    winston.info('Automatically extending facebook access token');

    FB.api(
        '/oauth/access_token',
        'GET',
        {
            client_id: config.facebook.clientID,
            client_secret: config.facebook.clientSecret,
            grant_type: 'fb_exchange_token',
            fb_exchange_token: config.facebook.accessToken
        },
        function (response) {
            if (response.error) {
                winston.error('Error extending facebook access token', response.error);
            } else {
                config.facebook.accessToken = response.access_token;
                FB.setAccessToken(config.facebook.accessToken);

                winston.info('Successfully extended facebook access token');
            }
        }
    );
};
