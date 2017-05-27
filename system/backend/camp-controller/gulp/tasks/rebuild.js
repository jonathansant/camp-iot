"use strict";

const runSequence = require("run-sequence");

exports.task = () => {
	return runSequence(
		"clean",
		"build"
	);
};