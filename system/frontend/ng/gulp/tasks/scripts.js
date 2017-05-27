"use strict";

const config = require("../config").config;
const gulp = require("gulp");
const buildScript = require("../common-utils/scripts");
const ts = require("gulp-typescript");

exports.task = () => {
	let tsOptions = ts.createProject("tsconfig.json");

	let globList = [
		`${config.typingsDir}/main.d.ts`,
		`${config.typingsDir}/browser.d.ts`,
		`${config.sourceDir}/**/*.ts`
	];

	let scriptsTempFolder = `${config.artifactsDir}/js`;

	return buildScript.build(globList, true, tsOptions)
		.pipe(gulp.dest(scriptsTempFolder));
};