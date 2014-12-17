'use strict';

var mailer = require('../../app/util/mailer'),
  winston = require('winston'),
  _ = require('lodash'),
  https = require('https');

function getSitemap() {

  var options = {
    host: '1roof.be',
    path: '/sitemap.xml'
  };

  var callback = function(response) {

    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {

      var urls = str.match(/<loc>(.*)<\/loc>/g);

      var i = 0;
      var gogo = setInterval(function() {

        if (i === urls.length) {
          clearInterval(gogo);
          return;
        }
        var url = urls[i].replace('<loc>', '').replace('</loc>', '');

        winston.info('Caching %s', url);

        https.get(url + '?_escaped_fragment_=', function() {});

        i++;

      }, 4000);


    });
  };

  https.get(options, callback).end();
}

exports.run = function() {

  winston.info('Cache job started ..');

  getSitemap();

};