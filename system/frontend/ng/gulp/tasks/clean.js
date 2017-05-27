"use strict";

const del = require("del");
const config = require("../config").config;

exports.task = () => {
	return del([
		`${config.outputDir}/*`,
		`${config.artifactsDir}/*`,
		`${config.deployDir}/*`,
		`!${config.deployDir}/.git`
	], {
		force: true
	});
};