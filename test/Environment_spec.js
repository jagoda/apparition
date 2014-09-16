"use strict";
var Environment = require("../lib/Environment");
var Lab         = require("lab");
var script      = exports.lab = Lab.script();

var after    = script.after;
var before   = script.before;
var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("an Environment", function () {
	var environment;

	function set (name, value) {
		var previous = process.env[name];

		if ("undefined" === typeof value) {
			delete process.env[name];
		}
		else {
			process.env[name] = value;
		}

		return set.bind(null, name, previous);
	}

	before(function (done) {
		environment = new Environment();
		done();
	});

	describe("retrieving a variable that is not defined", function () {
		var restore;
		var result;

		before(function (done) {
			restore = set("FOO");
			result  = environment.get("foo");
			done();
		});

		after(function (done) {
			restore();
			done();
		});

		it("returns 'undefined'", function (done) {
			expect(result, "result").to.be.undefined;
			done();
		});
	});

	describe("retrieving a variable that is defined", function () {
		var restore;
		var result;

		before(function (done) {
			restore = set("FOO", "bar");
			result  = environment.get("foo");
			done();
		});

		after(function (done) {
			restore();
			done();
		});

		it("returns the value", function (done) {
			expect(result, "result").to.equal("bar");
			done();
		});
	});
});
