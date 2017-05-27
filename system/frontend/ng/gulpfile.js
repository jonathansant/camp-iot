"use strict";

let gulp = require("gulp");
let fs = require("fs");

fs.readdirSync("./gulp/tasks")
	.filter((fileName) => {
		return fileName.match(/\.js$/i);
	})
	.map((fileName) => {
		return {
			name: fileName.substr(0, fileName.length - 3),
			contents: require("./gulp/tasks/" + fileName)
		};
	})
	.forEach((file) => {
		gulp.task(file.name, file.contents.dependencies, file.contents.task);
	});