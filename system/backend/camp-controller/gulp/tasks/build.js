"use strict";

const config = require("../config").config;
const gulp = require("gulp");
const buildScript = require("../common-utils/scripts");
const ts = require("gulp-typescript");

exports.task = () => {
	let tsOptions = ts.createProject("tsconfig.json");

	let globList = [
		`${config.typingsDir}/*.d.ts`,
		`${config.sourceDir}/**/*.ts`,
		`${config.sourceDir}/**/*.spec.ts`
	];

	return buildScript.build(globList, true, tsOptions)
		.pipe(gulp.dest(config.outputDir));
};