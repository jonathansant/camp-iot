const gulp = require("gulp");
const copy = require("gulp-copy");
const config = require("../config").config;
const es = require("event-stream");

exports.task = () => {
	"use strict";

	let templatesStream = gulp.src([
			`${config.sourceDir}/**/*.html`,
			`!${config.sourceDir}/index.html`
		])
		.pipe(copy(`${config.outputDir}/templates`, {prefix: 2}));

	let indexStream = gulp.src(`${config.sourceDir}/index.html`)
		.pipe(copy(`${config.outputDir}`, {prefix: 1}));

	return es.merge(templatesStream, indexStream);
};