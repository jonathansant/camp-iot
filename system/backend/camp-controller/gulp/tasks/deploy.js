"use strict";

const runSequence = require("run-sequence");
const gulp = require("gulp");
const config = require("../config").config;
const install = require("gulp-install");

exports.task = () => {

};

gulp.task("deploy:create", () => {
	return runSequence(
		"clean",
		"build",
		"deploy:copy"
	);
});

gulp.task("deploy:copy", () => {
	return gulp.src([`${config.outputDir}/**/*`, `!${config.outputDir}/**/*.spec.js`, "package.json"])
		.pipe(gulp.dest(config.deployDir))
		.pipe(install({
			production: true
		}));
});