"use strict";
var Properties = require("../lib/Properties");
var Lab         = require("lab");
var script      = exports.lab = Lab.script();

var after    = script.after;
var before   = script.before;
var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("Properties", function () {
	function describeDeleteProperty (context) {
		before(function (done) {
			context.originalValue = context.properties.getProperty(context.name);
			context.result        = context.properties.deleteProperty(context.name);
			done();
		});

		it("unsets the value", function (done) {
			expect(context.properties.getProperty(context.name), "value").to.be.undefined;
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
				expect(context.properties.getProperty(context.name), "value")
				.to.equal(context.originalValue);

				done();
			});
		});
	}

	function describeSetProperty (context) {
		before(function (done) {
			context.originalValue = context.properties.getProperty(context.name);
			context.result        = context.properties.setProperty(context.name, context.value);
			done();
		});

		it("sets the value", function (done) {
			expect(context.properties.getProperty(context.name), "value").to.equal(context.value);
			done();
		});

		describeRestoreFunction(context);
	}

	describe("retrieving a property that is not defined", function () {
		var result;

		before(function (done) {
			var properties = new Properties({});

			result = properties.getProperty("foo");
			done();
		});

		it("returns 'undefined'", function (done) {
			expect(result, "result").to.be.undefined;
			done();
		});
	});

	describe("retrieving a property that is defined", function () {
		var result;

		before(function (done) {
			var properties = new Properties({
				foo : "bar"
			});

			result  = properties.getProperty("foo");
			done();
		});

		it("returns the value", function (done) {
			expect(result, "result").to.equal("bar");
			done();
		});
	});

	describe("setting a property that is not defined", function () {
		var context = {
			properties : new Properties({}),
			name       : "foo",
			value      : "bar"
		};

		describeSetProperty(context);
	});

	describe("setting a property that is already defined", function () {
		var context = {
			properties : new Properties({
				foo : "bar"
			}),
			name       : "foo",
			value      : "bar"
		};

		describeSetProperty(context);
	});

	describe("deleting a property that is not defined", function () {
		var context = {
			properties : new Properties({}),
			name       : "foo"
		};

		describeDeleteProperty(context);
	});

	describe("deleting a property that is defined", function () {
		var context = {
			properties : new Properties({
				foo : "foo"
			}),
			name       : "foo"
		};

		describeDeleteProperty(context);
	});

	describe("restoring all changes", function () {
		var properties = new Properties({});

		var bar;
		var foo;

		before(function (done) {
			bar = properties.getProperty("bar");
			foo = properties.getProperty("foo");

			properties.setProperty("bar", "bar");
			properties.deleteProperty("foo");
			properties.restore();
			done();
		});

		it("reverts all changes to the properties", function (done) {
			expect(properties.getProperty("bar"), "bar").to.equal(bar);
			expect(properties.getProperty("foo"), "foo").to.equal(foo);
			done();
		});
	});
});
