"use strict";

/**
 * Module dependencies.
 */
var express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  session = require("express-session"),
  compress = require("compression"),
  methodOverride = require("method-override"),
  cookieParser = require("cookie-parser"),
  helmet = require("helmet"),
  passport = require("passport"),
  mongoStore = require("connect-mongo")({
    session: session
  }),
  flash = require("connect-flash"),
  config = require("./config"),
  consolidate = require("consolidate"),
  swig = require("swig"),
  path = require("path"),
  cloudinary = require("cloudinary"),
  scheduler = require("./scheduler"),
  // added for socketio
  http = require("http"),
  // seo = require("mean-seo"),
  core = require("../app/controllers/core");

module.exports = function(db) {
  // Initialize express app
  var app = express();

  // added for socketio
  var server = http.Server(app);
  var io = require("socket.io").listen(server);
  io.serveClient(false);
  // Do not use websockets right now, doesn't work with our SSL connection
  io.set("transports", ["htmlfile", "xhr-polling", "polling"]);

  // Start the app by listening on <port>
  server.listen(config.port);

  // Globbing model files
  config.getGlobbedFiles("./app/models/**/*.js").forEach(function(modelPath) {
    require(path.resolve(modelPath));
  });

  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  app.locals.keywords = config.app.keywords;
  app.locals.facebookAppId = config.facebook.clientID;
  app.locals.jsFiles = config.getJavaScriptAssets();
  app.locals.cssFiles = config.getCSSAssets();
  // Set cloudinary config
  cloudinary.config(config.cloudinary);

  // Passing the request url to environment locals
  app.use(function(req, res, next) {
    res.locals.url = req.protocol + ":// " + req.headers.host + req.url;
    next();
  });

  // SEO functions
  //app.use(seo.init(config.seo));

  // Should be placed before express.static
  app.use(
    compress({
      filter: function(req, res) {
        return /json|text|javascript|css/.test(res.getHeader("Content-Type"));
      },
      level: 9
    })
  );

  // Showing stack errors
  app.set("showStackError", true);

  // Set swig as the template engine
  app.engine("server.view.html", consolidate[config.templateEngine]);
  swig.setDefaults({
    varControls: ["<%=", "%>"]
  });

  // Set views path and view engine
  app.set("view engine", "server.view.html");
  app.set("views", "./app/views");

  // Environment dependent middleware
  if (process.env.NODE_ENV === "development") {
    // Enable logger (morgan)
    app.use(morgan("dev"));

    // Disable views cache
    app.set("view cache", false);
  } else if (process.env.NODE_ENV === "production") {
    app.locals.cache = "memory";
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.json());
  app.use(methodOverride());

  // Enable jsonp
  app.enable("jsonp callback");

  // CookieParser should be above session
  app.use(cookieParser());

  // Express MongoDB session storage
  app.use(
    session({
      secret: config.sessionSecret,
      store: new mongoStore({
        url: config.db,
        mongoOptions: {
          collection: config.sessionCollection
        }
      })
    })
  );

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // connect flash for flash messages
  app.use(flash());

  // Use helmet to secure Express headers
  app.use(helmet.xframe("allow-from", "http://www.kotzoeker.be"));
  app.use(helmet.iexss());
  app.use(helmet.contentTypeOptions());
  app.use(helmet.ienoopen());
  app.disable("x-powered-by");

  // Setting the app router and static folder
  app.use(express.static(path.resolve("./public"), { maxAge: 86400000 }));

  // Enable CORS resuests
  // app.use(core.allowCORS);
  // Redirect when using heroku domain name
  app.use(core.redirectIfHeroko);

  // socketio middleware
  app.use(function(req, res, next) {
    req.io = io;
    next();
  });

  // Globbing routing files
  config.getGlobbedFiles("./app/routes/**/*.js").forEach(function(routePath) {
    require(path.resolve(routePath))(app);
  });

  // Catch-all route for pushstate
  app.route("*").get(core.index);

  // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
  app.use(function(err, req, res, next) {
    // If the error object doesn't exists
    if (!err) return next();

    // Log it
    console.error(err.stack);

    // Error page
    res.status(500).render("500", {
      error: err.stack
    });
  });

  // Assume 404 since no middleware responded
  app.use(function(req, res) {
    res.status(404).render("404", {
      url: req.originalUrl,
      error: "Not Found"
    });
  });

  // allow socket clients to connect privately in rooms
  io.on("connection", function(socket) {
    socket.on("join", function(room) {
      socket.join(room);
    });
    socket.on("leave", function(room) {
      socket.leave(room);
    });
  });

  scheduler.start();

  return app;
};
