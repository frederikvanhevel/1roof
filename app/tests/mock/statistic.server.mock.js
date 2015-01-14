'use strict';

var mongoose = require('mongoose'),
    RoomMock = require('./room'),
    Statistic = mongoose.model('Statistic');

module.exports = function() {
    return new Statistic({
        date: new Date(),
        room: new RoomMock(),
        views: 45,
        favorites: 11,
        messages: 3
    });
};
