'use strict';

module.exports = function(app) {
    var sitemap = require('../../app/util/sitemap'),
        core = require('../../app/controllers/core'),
        facebook = require('../util/facebook');

    // Root routing
    app.route('/').get(core.index);


    // app.route('/testfacebook').get(function(req, res) {
    //     facebook.postToPage();
    //     res.send(200);
    // });


    // sitemap generation
    app.route('/sitemap.xml').get(sitemap.create);

    // run cache job
    app.route('/api/jobs/runcache').get(core.runCacheJob);

    // client error logger
    app.route('/api/logger').post(core.clientLogger);

    app.route('/search/Aalst--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Aalst?_escaped_fragment_=');
    });
    app.route('/search/Antwerpen--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Antwerpen?_escaped_fragment_=');
    });
    app.route('/search/Brussel--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Brussel?_escaped_fragment_=');
    });
    app.route('/search/Mechelen--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Mechelen?_escaped_fragment_=');
    });
    app.route('/search/Geel--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Geel?_escaped_fragment_=');
    });
    app.route('/search/Gent--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Gent?_escaped_fragment_=');
    });
    app.route('/search/Genk--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Genk?_escaped_fragment_=');
    });
    app.route('/search/Hasselt--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Hasselt?_escaped_fragment_=');
    });
    app.route('/search/Brugge--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Brugge?_escaped_fragment_=');
    });
    app.route('/search/Kortrijk--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Kortrijk?_escaped_fragment_=');
    });
    app.route('/search/Leuven--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Leuven?_escaped_fragment_=');
    });
    app.route('/search/Turnhout--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Turnhout?_escaped_fragment_=');
    });
    app.route('/search/Aarlen--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Aarlen?_escaped_fragment_=');
    });
    app.route('/search/Aat--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Aat?_escaped_fragment_=');
    });
    app.route('/search/Andenne--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Andenne?_escaped_fragment_=');
    });
    app.route('/search/Asse--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Asse?_escaped_fragment_=');
    });
    app.route('/search/Bergen--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Bergen?_escaped_fragment_=');
    });
    app.route('/search/Charleroi--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Charleroi?_escaped_fragment_=');
    });
    app.route('/search/Dendermonde--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Dendermonde?_escaped_fragment_=');
    });
    app.route('/search/Dinant--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Dinant?_escaped_fragment_=');
    });
    app.route('/search/Doornik--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Doornik?_escaped_fragment_=');
    });
    app.route('/search/Hoei--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Hoei?_escaped_fragment_=');
    });
    app.route('/search/Luik--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Luik?_escaped_fragment_=');
    });
    app.route('/search/Liege--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Liege?_escaped_fragment_=');
    });
    app.route('/search/Mechelen--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Mechelen?_escaped_fragment_=');
    });
    app.route('/search/Moeskroen--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Moeskroen?_escaped_fragment_=');
    });
    app.route('/search/Namen--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Namen?_escaped_fragment_=');
    });
    app.route('/search/Njvel--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Njvel?_escaped_fragment_=');
    });
    app.route('/search/Oostende--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Oostende?_escaped_fragment_=');
    });
    app.route('/search/Roeselare--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Roeselare?_escaped_fragment_=');
    });
    app.route('/search/Sint-Niklaas--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Sint-Niklaas?_escaped_fragment_=');
    });
    app.route('/search/Tielt--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Tielt?_escaped_fragment_=');
    });
    app.route('/search/Tongeren--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Tongeren?_escaped_fragment_=');
    });
    app.route('/search/Torhout--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Torhout?_escaped_fragment_=');
    });
    app.route('/search/Verviers--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Verviers?_escaped_fragment_=');
    });
    app.route('/search/Vilvoorde--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Vilvoorde?_escaped_fragment_=');
    });
    app.route('/search/Waver--Belg%C3%AFe?_escaped_fragment_=').get(function(req, res) {
        res.redirect(301, '/search/Waver?_escaped_fragment_=');
    });

};
