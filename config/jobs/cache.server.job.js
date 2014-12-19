'use strict';

var winston = require('winston'),
  _ = require('lodash'),
  https = require('https'),
  config = require('../config'),
  BPromise = require('bluebird'),
  seo = require('mean-seo');

function cacheUrl(options) {
  var defer = BPromise.defer();

  winston.info('Start caching %s', options.url);

  seo.forceCache(options, function(err) {
    if (err) {
      winston.error('Error caching %s', options.url);
      return defer.reject(err);
    }
    else {
      winston.info('Done caching %s', options.url);
      return defer.resolve();
    }
  });

  return defer.promise;
}

exports.run = function() {

  winston.info('Cache job started ..');

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

      BPromise.reduce(urls, function(total, url) {
        url = url.replace('<loc>', '').replace('</loc>', '');
        var seoOptions = _.merge(config.seo, { url: url });

        return cacheUrl(seoOptions);
      }).finally(function() {
        winston.info('Done caching');
      });

    });
  };

  https.get(options, callback).end();

};