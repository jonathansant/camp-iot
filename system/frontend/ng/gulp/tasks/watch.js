"use strict";

const watch = require("gulp-watch");
const gulp = require("gulp");
const config = require("../config").config;
const es = require("event-stream");

exports.task = () => {
    let html = watch(`${config.sourceDir}/**/*.html`, () => {
        gulp.run(["html"]);
    });

    let sass = watch(`${config.sourceDir}/**/*.scss`, () => {
        gulp.run(["styles"]);
    });

    return es.merge(html, sass);
};