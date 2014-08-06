'use strict';

module.exports = function(app) {
  var sitemap = require('../../app/util/sitemap');

	// Root routing
	var core = require('../../app/controllers/core');
	app.route('/').get(core.index);

  // sitemap generation
  app.route('/sitemap.xml').get(sitemap.create);
};