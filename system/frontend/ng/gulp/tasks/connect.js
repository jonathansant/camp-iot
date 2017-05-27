const connect = require("gulp-connect");

exports.task = () => {
	"use strict";

	return connect.server({
		port: 9000,
		root: "_dist"
	});
};