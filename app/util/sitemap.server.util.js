'use strict';

var sm = require('sitemap'),
  Room = require('mongoose').model('Room');

exports.create = function(req, res) {

  var sitemap = sm.createSitemap ({
    hostname: 'http://localhost',
    cacheTime: 600000 // 600 sec - cache purge period
  });

  Room.find({ visible: true }).exec(function(err, rooms) {
    if (err) {
      return res.send(400);
    } else {
      addToSitemap(rooms);

      res.header('Content-Type', 'application/xml');
      res.send( sitemap.toString() );
    }
  });

  function addToSitemap(rooms) {
    rooms.forEach(function(room) {
      sitemap.add({ url: room.url });
    });
  }
  
};