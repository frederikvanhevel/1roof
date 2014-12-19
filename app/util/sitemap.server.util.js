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
        'Aalst--Belgïe',
        'Antwerpen--Belgïe',
        'Brussel--Belgïe',
        'Mechelen--Belgïe',
        'Geel--Belgïe',
        'Gent--Belgïe',
        'Genk--Belgïe',
        'Hasselt--Belgïe',
        'Brugge--Belgïe',
        'Kortrijk--Belgïe',
        'Leuven--Belgïe',
        'Turnhout--Belgïe',
        'Aarlen--Belgïe',
        'Aat--Belgïe',
        'Andenne--Belgïe',
        'Asse--Belgïe',
        'Bergen--Belgïe',
        'Charleroi--Belgïe',
        'Dendermonde--Belgïe',
        'Dinant--Belgïe',
        'Doornik--Belgïe',
        'Hoei--Belgïe',
        'Turnhout--Belgïe',
        'Louvain-La-Neuve--Belgïe',
        'Luik--Belgïe',
        'Mechelen--Belgïe',
        'Moeskroen--Belgïe',
        'Namen--Belgïe',
        'Njvel--Belgïe',
        'Oostende--Belgïe',
        'Roeselare--Belgïe',
        'Sint-Niklaas--Belgïe',
        'Tielt--Belgïe',
        'Tongeren--Belgïe',
        'Torhout--Belgïe',
        'Verviers--Belgïe',
        'Vilvoorde--Belgïe',
        'Waver--Belgïe',
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
