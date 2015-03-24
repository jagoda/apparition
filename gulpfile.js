"use strict";
var Bluebird = require("bluebird");
var Enforcer = require("gulp-istanbul-enforcer");
var Fs       = require("fs");
var Gulp     = require("gulp");
var Istanbul = require("gulp-istanbul");
var Jscs     = require("gulp-jscs");
var JsHint   = require("gulp-jshint");
var Mocha    = require("gulp-mocha");
var Path     = require("path");
var Stylish  = require("jshint-stylish");

var consume = require("stream-consume");
var _       = require("lodash");

Bluebird.promisifyAll(Fs);

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
	return Fs.readFileAsync(path, { encoding : "utf-8" })
	.then(function (contents) {
		return JSON.parse(contents);
	});
}

function promisefy (stream) {
	return new Bluebird(function (resolve, reject) {
		stream.once("finish", resolve);
		stream.once("error", reject);
		consume(stream);
	});
}

function style (options, files) {
	return Gulp.src(files).pipe(new Jscs(options));
}

Gulp.task("default", [ "test" ]);

Gulp.task("lint", [ "lint-source", "lint-test" ]);

Gulp.task("lint-source", function () {
	return loadOptions(paths.jshint.source)
	.then(function (options) {
		return promisefy(lint(options, paths.source));
	});
});

Gulp.task("lint-test", function () {
	return Bluebird.join(
		loadOptions(paths.jshint.source),
		loadOptions(paths.jshint.test),
		function (source, test) {
			var options = _.merge(source, test);
			return promisefy(lint(options, paths.test));
		}
	);
});

Gulp.task("style", function () {
	return loadOptions(paths.jscs)
	.then(function (options) {
		return promisefy(style(options, paths.source.concat(paths.test)));
	});
});

Gulp.task("test", [ "testcases" ], function () {
	var options = {
		coverageDirectory : "coverage",
		rootDirectory     : __dirname,

		thresholds : {
			branches   : 100,
			functions  : 100,
			lines      : 100,
			statements : 100
		}
	};

	return Gulp.src(".").pipe(new Enforcer(options));
});

Gulp.task("testcases", [ "lint", "style" ], function (done) {
	var stream = Gulp.src(paths.source)
	.pipe(new Istanbul())
	.pipe(Istanbul.hookRequire())
	.on("finish", function () {
		var stream = Gulp.src(paths.test)
		.pipe(new Mocha())
		.pipe(Istanbul.writeReports())
		.on("end", done);
		consume(stream);
	});
	consume(stream);
});
