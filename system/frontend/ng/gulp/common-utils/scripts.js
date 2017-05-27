"use strict";

const gulp = require("gulp");
const tslint = require("gulp-tslint");
const ts = require("gulp-typescript");
const stylish = require("gulp-tslint-stylish");
const sourcemaps = require("gulp-sourcemaps");
const gIf = require("gulp-if");
const ngAnnotate = require("gulp-ng-annotate");

exports.build = (globList, produceSourceMaps, tsOptions) => {
	var stream = gulp.src(globList)
		.pipe(gIf(produceSourceMaps, sourcemaps.init()))
		.pipe(gIf("**/*.ts", tslint({
			configuration: "tslint.json"
		})))
		.pipe(gIf("**/*.ts", tslint.report(stylish, {
			emitError: false,
			sort: true,
			bell: true
		})))
		.pipe(gIf("**/*.ts", ts(tsOptions, undefined, ts.reporter.fullReporter(ts.reporter.fullReporter(true)))))
		.pipe(ngAnnotate())
		.pipe(gIf(produceSourceMaps, sourcemaps.write()));

	return stream;
};