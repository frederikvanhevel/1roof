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
                return { url: room.url, lastmod: room.updated };
            }));
        }
    });

    return defer.promise;
}

function getFavorites() {
    // Not implemented yet
    return [];
}

function getSearchPages() {
    var links = [];
    var cities = [
        'Aalst--Belgïe?lat=50.9378101&lng=4.0409517000000506&proximity=7104.5',
        'Antwerpen--Belgïe?lat=51.2194475&lng=4.40246430000002&proximity=7061.5',
        'Brussel--Belgïe',
        'Mechelen--Belgïe?lat=51.0258761&lng=4.477536200000031&proximity=7091',
        'Geel--Belgïe?lat=51.16257&lng=4.990839999999935&proximity=7070',
        'Gent--Belgïe?lat=51.0543422&lng=3.717424299999948&proximity=7086.5',
        'Genk--Belgïe?lat=50.96613&lng=5.502100000000041&proximity=7100',
        'Hasselt--Belgïe?lat=50.93069&lng=5.332480000000032&proximity=7105.5',
        'Kortrijk--Belgïe?lat=50.8194776&lng=3.2577263000000585&proximity=7122.5',
        'Leuven--Belgïe?lat=50.883333&lng=4.7000000000000455&proximity=7113',
        'Turnhout--Belgïe?lat=51.3216509&lng=4.93755770000007&proximity=7045.5'
    ];

    cities.forEach(function(city) {
        links.push('/search/' + city);
    });

    return links;
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
      .join(getCommonPages(), getRooms(), getSearchPages(), getFavorites(), function(common, rooms, searchpages, favorites) {
        return common.concat(rooms, searchpages, favorites);
      }).then(function(result) {
        createSitemap(res, result);
      });

};
