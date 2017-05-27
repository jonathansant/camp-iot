"use strict";

const runSequence = require("run-sequence");
const gulp = require("gulp");
const config = require("../config").config;
const install = require("gulp-install");

exports.task = () => {
	return runSequence(
		"deploy:create",
		"deploy:copy"
	);
};

gulp.task("deploy:create", () => {
	return runSequence(
		"clean",
		"build",
		"styles",
		"html",
		"images"
	);
});

gulp.task("deploy:copy", () => {
	return gulp.src([`${config.outputDir}/**/*`, "bower.json"])
		.pipe(gulp.dest(config.deployDir))
		.pipe(install({
			production: true
		}));
});