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

	function describeRestoreFunction (context) {
		describe("and invoking the restore function", function () {
			var restore;

			before(function (done) {
				restore = context.result();
				done();
			});

			after(function (done) {
				restore();
				done();
			});

			it("undoes the set operation", function (done) {
				expect(environment.get("foo"), "value").to.equal(context.originalValue);
				done();
			});
		});
	}

	function describeSet (context) {
		it("sets the value", function (done) {
			expect(environment.get("foo"), "value").to.equal("bar");
			done();
		});

		it("returns a 'restore' function", function (done) {
			expect(context.result, "type").to.be.a("function");
			done();
		});

		describeRestoreFunction(context);
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

	describe("setting a variable that is not defined", function () {
		var context = {};
		var restore;

		before(function (done) {
			restore = set("FOO");

			context.originalValue = environment.get("foo");
			context.result        = environment.set("foo", "bar");
			done();
		});

		after(function (done) {
			restore();
			done();
		});

		describeSet(context);
	});

	describe("setting a variable that is already defined", function () {
		var context = {};
		var restore;

		before(function (done) {
			restore = set("FOO", "bar");

			context.originalValue = environment.get("foo");
			context.result        = environment.set("foo", "bar");
			done();
		});

		after(function (done) {
			restore();
			done();
		});

		describeSet(context);
	});

	describe("restoring all changes", function () {
		var restore = [];

		var bar;
		var foo;

		before(function (done) {
			bar = environment.get("bar");
			foo = environment.get("foo");

			restore.push(set("BAR"));
			restore.push(set("FOO"));

			environment.set("bar", "bar");
			environment.set("foo", "foo");
			environment.restore();
			done();
		});

		after(function (done) {
			restore.forEach(function (restore) {
				return restore();
			});
			done();
		});

		it("reverts all changes to the environment", function (done) {
			expect(environment.get("bar"), "bar").to.equal(bar);
			expect(environment.get("foo"), "foo").to.equal(foo);
			done();
		});
	});
});
