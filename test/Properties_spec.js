"use strict";
var Properties = require("../lib/Properties");

var expect = require("chai").expect;

describe("A Properties helper", function () {
	describe("retrieving a property that is not defined", function () {
		var properties = new Properties({});

		var result;

		before(function () {
			result = properties.get("foo");
		});

		it("returns 'undefined'", function () {
			expect(result, "result").to.be.undefined;
		});
	});

	describe("retrieving a property that is defined", function () {
		var properties = new Properties({
			foo : "bar"
		});

		var result;

		before(function () {
			result = properties.get("foo");
		});

		it("returns the value", function () {
			expect(result, "result").to.equal("bar");
		});
	});

	describe("setting a property that is not defined", function () {
		var object     = {};
		var properties = new Properties(object);

		before(function () {
			properties.set("foo", "bar");
		});

		it("updates the value", function () {
			expect(object, "value").to.have.property("foo", "bar");
		});

		describe("then reverting the changes", function () {
			before(function () {
				properties.restore();
			});

			it("restores the previous value", function () {
				expect(object, "value").not.to.have.property("foo");
			});
		});
	});

	describe("setting a property that is already defined", function () {
		var object     = { foo : "bar" };
		var properties = new Properties(object);

		before(function () {
			properties.set("foo", "foo");
		});

		it("updates the value", function () {
			expect(object, "value").to.have.property("foo", "foo");
		});

		describe("then reverting the changes", function () {
			before(function () {
				properties.restore();
			});

			it("restores the previous value", function () {
				expect(object, "value").to.have.property("foo", "bar");
			});
		});
	});

	describe("deleting a property that is not defined", function () {
		var object     = {};
		var properties = new Properties(object);

		before(function () {
			properties.delete("foo");
		});

		it("does nothing", function () {
			expect(object, "keys").to.be.empty;
		});

		describe("then reverting the changes", function () {
			before(function () {
				properties.restore();
			});

			it("does nothing", function () {
				expect(object, "keys").to.be.empty;
			});
		});
	});

	describe("deleting a property that is defined", function () {
		var object     = { foo : "bar" };
		var properties = new Properties(object);

		before(function () {
			properties.delete("foo");
		});

		it("removes the value", function () {
			expect(object, "value").not.to.have.property("foo");
		});

		describe("then reverting the changes", function () {
			before(function () {
				properties.restore();
			});

			it("restores the previous value", function () {
				expect(object, "value").to.have.property("foo", "bar");
			});
		});
	});

	describe("chaining multiple operations", function () {
		var object     = { testy : "tester" };
		var properties = new Properties(object);

		before(function () {
			properties
			.set("foo", "foo")
			.set("bar", "bar")
			.set("baz", "baz")
			.delete("foo")
			.delete("baz")
			.set("bar", "foo")
			.set("baz", "bar");
		});

		it("applies all operations sequentially", function () {
			expect(object, "properties").to.deep.equal({
				bar   : "foo",
				baz   : "bar",
				testy : "tester"
			});
		});

		describe("then reverting the changes", function () {
			before(function () {
				properties.restore();
			});

			it("restores the previous values", function () {
				expect(object, "properties").to.deep.equal({ testy : "tester" });
			});
		});
	});
});
