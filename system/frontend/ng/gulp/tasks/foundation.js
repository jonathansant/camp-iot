const gulp = require("gulp");
const scriptBuilder = require("../common-utils/scripts");
const concat = require("gulp-concat");
const config = require("../config").config;
const replace = require("gulp-replace");
const es = require("event-stream");
const copy = require("gulp-copy");

exports.task = () => {
	"use strict";

	// let foundationJS = [
	// 	"bower_components/viewport-units-buggyfill/viewport-units-buggyfill.js",
	// 	"bower_components/tether/tether.js",
	// 	"bower_components/hammerjs/hammer.js",
	// 	"bower_components/foundation/js/foundation.js",
	// 	"bower_components/foundation/js/foundation/foundation.js",
	// 	"bower_components/foundation/js/foundation/foundation.offcanvas.js",
	// 	"bower_components/foundation-apps/js/vendor/**/*.js",
	// 	"bower_components/foundation-apps/js/angular/**/*.js",
	// 	"!bower_components/foundation-apps/js/angular/app.js"
	// ];

	let foundationJS = [
		"bower_components/viewport-units-buggyfill/viewport-units-buggyfill.js",
		"bower_components/tether/tether.js",
		"bower_components/hammerjs/hammer.js",
		"bower_components/foundation/js/foundation.js",
		"bower_components/foundation/js/foundation/foundation.js",
		"bower_components/foundation/js/foundation/foundation.offcanvas.js",
		"bower_components/foundation-apps/dist/js/foundation-apps.js",
		"bower_components/foundation-apps/dist/js/foundation-apps-templates.js"
	];


	///---------------------------Hack------------------------------------------>
	///Temporary hack until the bug is fixed
	// let replaceStream = gulp.src("bower_components/foundation-apps/js/vendor/iconic.min.js")
	// 	.pipe(replace("/iconic-bg-/.test", "new RegExp(\"iconic-bg-\").test"))
	// 	.pipe(gulp.dest((data) => {
	// 		return data.base;
	// 	}));
	///---------------------------Hack------------------------------------------>

	///---------------------------Hack------------------------------------------>
	///Temporary hack until the bug is fixed
	let replaceStream = gulp.src("bower_components/foundation-apps/dist/js/foundation-apps.js")
		.pipe(replace("/iconic-bg-/.test", "new RegExp(\"iconic-bg-\").test"))
		.pipe(gulp.dest((data) => {
			return data.base;
		}));
	///---------------------------Hack------------------------------------------>

	let foundationStrm = scriptBuilder.build(foundationJS, false)
		.pipe(concat("foundation.js"))
		.pipe(gulp.dest(`${config.artifactsDir}/js`));

	// let iconStream = gulp.src(`${config.sourceDir}/shared/foundation-icons/**/*`)
	// 	.pipe(copy(`${config.outputDir}/css`, {prefix: 2}));

	let iconStream = gulp.src("bower_components/foundation-apps/iconic/*.svg")
		.pipe(copy(`${config.outputDir}/assets/img`, {prefix: 2}));

	return es.merge(replaceStream, foundationStrm, iconStream);
};