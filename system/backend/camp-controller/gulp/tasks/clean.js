"use strict";

const del = require("del");
const config = require("../config").config;

exports.task = () => {
	return del([`${config.outputDir}/*`, `${config.deployDir}/*`], {
		force: true
	});
};