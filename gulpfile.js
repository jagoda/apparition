"use strict";
var Fs      = require("fs");
var Gulp    = require("gulp");
var Jscs    = require("gulp-jscs");
var JsHint  = require("gulp-jshint");
var Lab     = require("gulp-lab");
var Path    = require("path");
var Q       = require("q");
var Stylish = require("jshint-stylish");

var consume = require("stream-consume");
var _       = require("lodash");

var paths = {
	jscs : Path.join(__dirname, ".jscsrc"),

	jshint : {
		source : Path.join(__dirname, ".jshintrc"),
		test   : Path.join(__dirname, "test", ".jshintrc")
	},

	source : [
		Path.join(__dirname, "*.js"),
		Path.join(__dirname, "lib", "**", "*.js")
	],

	test : [
		Path.join(__dirname, "test", "**", "*_spec.js")
	]
};

function lint (options, files) {
	return Gulp.src(files)
	.pipe(new JsHint(options))
	.pipe(JsHint.reporter(Stylish))
	.pipe(JsHint.reporter("fail"));
}

function loadOptions (path) {
	return Q.ninvoke(Fs, "readFile", path, { encoding : "utf8" })
	.then(function (contents) {
		return JSON.parse(contents);
	});
}

function promisefy (stream) {
	var deferred = Q.defer();

	stream.once("finish", deferred.resolve.bind(deferred));
	stream.once("error", deferred.reject.bind(deferred));
	consume(stream);

	return deferred.promise;
}

function style (options, files) {
	return Gulp.src(files).pipe(new Jscs(options));
}

Gulp.task("coverage", function () {
	var options = {
		args : "-p -r html -o" + Path.join(__dirname, "coverage.html"),
		opts : { emitLabError : false }
	};

	return Gulp.src(paths.test).pipe(new Lab(options));
});

Gulp.task("default", [ "test" ]);

Gulp.task("lint", [ "lint-source", "lint-test" ]);

Gulp.task("lint-source", function () {
	return loadOptions(paths.jshint.source)
	.then(function (options) {
		return promisefy(lint(options, paths.source));
	});
});

Gulp.task("lint-test", function () {
	return Q.all([
		loadOptions(paths.jshint.source),
		loadOptions(paths.jshint.test)
	])
	.spread(function (source, test) {
		var options = _.merge(source, test);
		return promisefy(lint(options, paths.test));
	});
});

Gulp.task("style", function () {
	return loadOptions(paths.jscs)
	.then(function (options) {
		return promisefy(style(options, paths.source.concat(paths.test)));
	});
});

Gulp.task("test", [ "lint", "style" ], function () {
	var options = {
		args : "-p -t 100",
		opts : { emitLabError : true }
	};

	return Gulp.src(paths.test).pipe(new Lab(options));
});
