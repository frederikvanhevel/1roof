'use strict';

module.exports = function(app) {
    var sitemap = require('../../app/util/sitemap'),
		core = require('../../app/controllers/core');

	// Root routing
	app.route('/').get(core.index);

    // sitemap generation
    app.route('/sitemap.xml').get(sitemap.create);

    // run cache job
    app.route('/api/jobs/runcache').get(core.runCacheJob);
};
