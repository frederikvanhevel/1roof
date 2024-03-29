"use strict";
/**
 * Module dependencies.
 */

// newrrelic reporting
// require('newrelic');

var init = require("./config/init")(),
  config = require("./config/config"),
  mongoose = require("mongoose"),
  session = require("express-session"),
  mongoStore = require("connect-mongo")({
    session: session
  });

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, { useMongoClient: true });

// Init the express application
var app = require("./config/express")(db);

// Bootstrap passport config
require("./config/passport")();

// Expose app
exports = module.exports = app;

// Logging initialization
console.log("MEAN.JS application started on port " + config.port);
