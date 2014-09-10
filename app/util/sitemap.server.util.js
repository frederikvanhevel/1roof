'use strict';

var sm = require('sitemap'),
    async = require('async'),
    Room = require('mongoose').model('Room'),
    config = require('../../config/config');



function getRooms(done, sitemapItems) {
    Room.find({ 'visible': true }, 'slug url updated', function(err, rooms) {
        if (err) return done(err);
        else {
            var results = rooms.map(function(room) {
                return { url: room.url };
            });
            done(null, results);
        }
    });
}

function getFavorites(done, sitemapItems) {
    // Not implemented yet
    done(null, []);
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

    async.parallel([
        function(done) {
            getRooms(done, sitemapItems);
        },
        function(done) {
            getFavorites(done, sitemapItems);
        }
        ],
        function(err, results) {
            var sitemapItems = [];

            results.forEach(function(arr) {
                sitemapItems = sitemapItems.concat(arr);
            });

            createSitemap(res, sitemapItems);
        }
    );

};
