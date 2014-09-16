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

	function describeDelete (context) {
		it("unsets the value", function (done) {
			expect(context.environment.get(context.name), "value").to.be.undefined;
			done();
		});

		describeRestoreFunction(context);
	}

	function describeRestoreFunction (context) {
		it("returns a 'restore' function", function (done) {
			expect(context.result, "type").to.be.a("function");
			done();
		});

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
				expect(context.environment.get(context.name), "value")
				.to.equal(context.originalValue);

				done();
			});
		});
	}

	function describeSet (context) {
		it("sets the value", function (done) {
			expect(context.environment.get(context.name), "value").to.equal(context.value);
			done();
		});

		describeRestoreFunction(context);
	}

	describe("retrieving a variable that is not defined", function () {
		var restore;
		var result;

		before(function (done) {
			var environment = new Environment();

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
			var environment = new Environment();

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
		var context = {
			environment : new Environment(),
			name        : "foo",
			value       : "bar"
		};

		var restore;

		before(function (done) {
			restore = set("FOO");

			context.originalValue = context.environment.get(context.name);
			context.result        = context.environment.set(context.name, context.value);
			done();
		});

		after(function (done) {
			restore();
			done();
		});

		describeSet(context);
	});

	describe("setting a variable that is already defined", function () {
		var context = {
			environment : new Environment(),
			name        : "foo",
			value       : "bar"
		};

		var restore;

		before(function (done) {
			restore = set("FOO", "bar");

			context.originalValue = context.environment.get(context.name);
			context.result        = context.environment.set(context.name, context.value);
			done();
		});

		after(function (done) {
			restore();
			done();
		});

		describeSet(context);
	});

	describe("deleting a variable that is not defined", function () {
		var context = {
			environment : new Environment(),
			name        : "foo"
		};

		var restore;

		before(function (done) {
			restore = set("FOO");

			context.originalValue = context.environment.get(context.name);
			context.result        = context.environment.delete(context.name);
			done();
		});

		after(function (done) {
			restore();
			done();
		});

		describeDelete(context);
	});

	describe("deleting a variable that is defined", function () {
		var context = {
			environment : new Environment(),
			name        : "foo"
		};

		var restore;

		before(function (done) {
			restore = set("FOO", "foo");

			context.originalValue = context.environment.get(context.name);
			context.result        = context.environment.delete(context.name);
			done();
		});

		after(function (done) {
			restore();
			done();
		});

		describeDelete(context);
	});

	describe("restoring all changes", function () {
		var environment = new Environment();
		var restore     = [];

		var bar;
		var foo;

		before(function (done) {
			restore.push(set("BAR"));
			restore.push(set("FOO", "foo"));

			bar = environment.get("bar");
			foo = environment.get("foo");

			environment.set("bar", "bar");
			environment.delete("foo");
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
