'use strict';

var sm = require('sitemap'),
    BPromise = require('bluebird'),
    Room = require('mongoose').model('Room'),
    config = require('../../config/config');


function getCommonPages() {
    return [
        '/rooms/new',
        '/pricing',
        '/about'
    ];
}

function getRooms() {
    var defer = BPromise.defer();

    Room.find({ 'visible': true }, 'slug url updated', function(err, rooms) {
        if (err) defer.reject(err);
        else {
            defer.resolve(rooms.map(function(room) {
                return { url: room.url };
            }));
        }
    });

    return defer.promise;
}

function getFavorites() {
    // Not implemented yet
    return [];
}

function createSitemap(res, urls) {
    var sitemap = sm.createSitemap({
        hostname: config.app.host,
        cacheTime: 600000, // 600 sec - cache purge period
        urls: urls
    });

    res.header('Content-Type', 'application/xml');
    res.send( sitemap.toString() );
}

exports.create = function(req, res) {

    var sitemapItems = [];

    BPromise
      .join(getRooms(), getFavorites(), function(rooms, favorites) {
        return rooms.concat(favorites);
      }).then(function(result) {
        createSitemap(res, result);
      });

};
