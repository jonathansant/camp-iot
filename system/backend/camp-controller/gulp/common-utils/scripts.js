"use strict";

//const config = require("../config").config;
const gulp = require("gulp");
const tslint = require("gulp-tslint");
const ts = require("gulp-typescript");
const stylish = require("gulp-tslint-stylish");
const sourcemaps = require("gulp-sourcemaps");
const gIf = require("gulp-if");

exports.build = (globList, produceSourceMaps, tsOptions) => {
    var stream = gulp.src(globList)
        .pipe(gIf(produceSourceMaps, sourcemaps.init()))
        .pipe(tslint({
            configuration: "tslint.json"
        }))
        .pipe(tslint.report(stylish, {
            emitError: false,
            sort: true,
            bell: true
        }))
        .pipe(ts(tsOptions, undefined, ts.reporter.fullReporter(ts.reporter.fullReporter(true))))
        .pipe(gIf(produceSourceMaps, sourcemaps.write()));

    return stream;
};