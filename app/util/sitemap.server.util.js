'use strict';

var sm = require('sitemap'),
    BPromise = require('bluebird'),
    Room = require('mongoose').model('Room'),
    config = require('../../config/config');


function getCommonPages() {
    return [
        '/rooms/new',
        '/signin',
        '/signup',
        '/about'
    ];
}

function getRooms() {
    var defer = BPromise.defer();

    // Slug is apparently necessary, do not remove!
    Room.find({ 'isInOrder': true }, 'slug url updated', function(err, rooms) {
        if (err) defer.reject(err);
        else {
            defer.resolve(rooms.map(function(room) {
                return { url: room.url, changefreq: 'daily', lastmod: room.updated };
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
        'Aalst',
        'Antwerpen',
        'Antwerp',
        'Brussel',
        'Brussels?lang=en',
        'Mechelen',
        'Geel',
        'Gent',
        'Ghent?lang=en',
        'Genk',
        'Hasselt',
        'Brugge',
        'Bruges?lang=en',
        'Kortrijk',
        'Leuven',
        'Turnhout',
        'Aarlen',
        'Aat',
        'Andenne',
        'Asse',
        'Bergen',
        'Charleroi',
        'Dendermonde',
        'Dinant',
        'Doornik',
        'Hoei',
        'Turnhout',
        'Louvain-La-Neuve',
        'Luik',
        'Liege',
        'Mechelen',
        'Moeskroen',
        'Namen',
        'Njvel',
        'Oostende',
        'Ostend?lang=en',
        'Roeselare',
        'Sint-Niklaas',
        'Tielt',
        'Tongeren',
        'Torhout',
        'Verviers',
        'Vilvoorde',
        'Waver',
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

    BPromise.join(getCommonPages(), getRooms(), getSearchPages(), getFavorites(), function(common, rooms, searchpages, favorites) {
        return common.concat(rooms, searchpages, favorites);
    }).then(function(result) {
        createSitemap(res, result);
    });

};
