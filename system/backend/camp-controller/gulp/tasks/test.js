"use strict";

const gulp = require("gulp");
const jasmine = require("gulp-jasmine");
const config = require("../config").config;
const SpecReporter = require("jasmine-spec-reporter");

exports.task = () => {
	let testStream = gulp.src(`${config.outputDir}/**/*.spec.js`)
		.pipe(jasmine({
			reporter: new SpecReporter()
		}));

	return testStream;
};