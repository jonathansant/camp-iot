const gulp = require("gulp");
const copy = require("gulp-copy");
const config = require("../config").config;

exports.task = () => {
	"use strict";

	let imagesStream = gulp.src([
			`${config.sourceDir}/**/*.svg`,
			`${config.sourceDir}/**/*.png`,
			`${config.sourceDir}/**/*.jpg`,
			`!${config.sourceDir}/**/foundation-icons/**/*`
		])
		.pipe(copy(`${config.outputDir}/images`, {prefix: 3}));

	return imagesStream;
};