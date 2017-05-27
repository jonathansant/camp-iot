const sass = require("gulp-sass");
const gulp = require("gulp");
const config = require("../config").config;
const concat = require("gulp-concat");
const cleanCss = require("gulp-clean-css");
const runSequence = require("run-sequence");

exports.task = () => {
	"use strict";

	// let foundationJS = [
	// 	"bower_components/foundation/scss/",
	// 	"bower_components/foundation-apps/scss/"
	// ];

	// return gulp.src(
	// 	[
	// 		`${config.sourceDir}/shared/styles/app.scss`
	// 	])
	// 	.pipe(sass({
	// 		includePaths: foundationJS
	// 	}).on("error", sass.logError))
	// 	.pipe(gulp.src(
	// 		"bower_components/foundation-apps/dist/css/foundation-apps.css"))
	// 	.pipe(cleanCss({compatibility: "ie10"}))
	// 	.pipe(concat("styles.css"))
	// 	.pipe(gulp.dest(`${config.outputDir}/css`));

	return runSequence("styles:sass", "styles:css");
};

gulp.task("styles:sass", () => {
	"use strict";

	let foundationJS = [
		"bower_components/foundation/scss/",
		"bower_components/foundation-apps/scss/"
	];

	return gulp.src([
			`${config.sourceDir}/shared/styles/app.scss`
		])
		.pipe(sass({
			includePaths: foundationJS
		}).on("error", sass.logError))
		.pipe(gulp.dest(`${config.artifactsDir}/css`));
});

gulp.task("styles:css", () => {
	"use strict";

	return gulp.src([
			"bower_components/foundation-apps/dist/css/foundation-apps.css",
			`${config.artifactsDir}/css/app.css`
		])
		.pipe(cleanCss({compatibility: "ie10"}))
		.pipe(concat("styles.css"))
		.pipe(gulp.dest(`${config.outputDir}/css`));
});