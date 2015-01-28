'use strict';

var config = require('../../config/config'),
    winston = require('winston'),
    FB = require('fb');

FB.setAccessToken(config.facebook.longToken);

function limitText(text) {
    var LIMIT_TO = 300;

    text = text.replace(/(?:\r\n|\r|\n)/g, ' ');
    if (text.length > LIMIT_TO) return text.substring(0, LIMIT_TO) + '...';
    else return text;
}

exports.postToPage = function(room) {

    FB.api(
        '/' + config.facebook.pageID + '/feed',
        'POST',
        {
            'message': limitText(room.info.description),
            'link': 'https://1roof.be' + room.url,
            'published': true
        },
        function (response) {
            if (response.error) {
                winston.error('Facebook error', response.error);
            }
        }
    );

};
