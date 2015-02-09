"use strict";
var Code       = require("code");
var Properties = require("../lib/Properties");
var Lab         = require("lab");
var script      = exports.lab = Lab.script();

var after    = script.after;
var before   = script.before;
var describe = script.describe;
var expect   = Code.expect;
var it       = script.it;

describe("Properties", function () {
	function describeDelete (context) {
		before(function (done) {
			context.originalValue = context.properties.get(context.name);
			context.result        = context.properties.delete(context.name);
			done();
		});

		it("unsets the value", function (done) {
			expect(context.properties.get(context.name), "value").to.be.undefined();
			done();
		});

		describeRestoreFunction(context);
	}

	function describeRestoreFunction (context) {
		it("returns a 'restore' function", function (done) {
			expect(context.result, "type").to.be.a.function();
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
				expect(context.properties.get(context.name), "value")
				.to.equal(context.originalValue);

				done();
			});
		});
	}

	function describeSet (context) {
		before(function (done) {
			context.originalValue = context.properties.get(context.name);
			context.result        = context.properties.set(context.name, context.value);
			done();
		});

		it("sets the value", function (done) {
			expect(context.properties.get(context.name), "value").to.equal(context.value);
			done();
		});

		describeRestoreFunction(context);
	}

	describe("retrieving a property that is not defined", function () {
		var result;

		before(function (done) {
			var properties = new Properties({});

			result = properties.get("foo");
			done();
		});

		it("returns 'undefined'", function (done) {
			expect(result, "result").to.be.undefined();
			done();
		});
	});

	describe("retrieving a property that is defined", function () {
		var result;

		before(function (done) {
			var properties = new Properties({
				foo : "bar"
			});

			result  = properties.get("foo");
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

		describeSet(context);
	});

	describe("setting a property that is already defined", function () {
		var context = {
			properties : new Properties({
				foo : "bar"
			}),
			name       : "foo",
			value      : "bar"
		};

		describeSet(context);
	});

	describe("deleting a property that is not defined", function () {
		var context = {
			properties : new Properties({}),
			name       : "foo"
		};

		describeDelete(context);
	});

	describe("deleting a property that is defined", function () {
		var context = {
			properties : new Properties({
				foo : "foo"
			}),
			name       : "foo"
		};

		describeDelete(context);
	});

	describe("restoring all changes", function () {
		var properties = new Properties({});

		var bar;
		var foo;

		before(function (done) {
			bar = properties.get("bar");
			foo = properties.get("foo");

			properties.set("bar", "bar");
			properties.delete("foo");
			properties.restore();
			done();
		});

		it("reverts all changes to the properties", function (done) {
			expect(properties.get("bar"), "bar").to.equal(bar);
			expect(properties.get("foo"), "foo").to.equal(foo);
			done();
		});
	});
});
