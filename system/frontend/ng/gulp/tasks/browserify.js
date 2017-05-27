"use strict";

const browserify = require("browserify");
const source = require("vinyl-source-stream");
const config = require("../config").config;
const gulp = require("gulp");
const through = require("through2");
const uglify = require("gulp-uglify");
const buffer = require("vinyl-buffer");
const browserify_shim = require("browserify-shim");
const sourcemaps = require("gulp-sourcemaps");

exports.task = () => {
	let scriptsTempFolder = `${config.artifactsDir}/js`;
	let bundledStream = through();

	browserify(`${scriptsTempFolder}/app.js`)
		.transform(browserify_shim)
		.bundle()
		.pipe(source("scripts.js"))
		.pipe(buffer())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(`${config.outputDir}/js`));

	return bundledStream;
};