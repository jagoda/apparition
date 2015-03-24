"use strict";
var Environment = require("../lib/Environment");
var Properties  = require("../lib/Properties");

var expect = require("chai").expect;

describe("An Environment helper", function () {
	var environment;
	var env;

	before(function () {
		env = process.env;
		process.env = {};
		environment = new Environment();
	});

	after(function () {
		process.env = env;
	});

	it("is a Properties instance", function () {
		expect(environment, "type").to.be.an.instanceof(Properties);
	});

	describe("deleting a property", function () {
		var name           = "test";
		var normalizedName = name.toUpperCase();
		var value          = "super-awesome-test-value";

		before(function () {
			process.env[normalizedName] = value;
			environment.delete(name);
		});

		after(function () {
			delete process.env[normalizedName];
		});

		it("unsets the environment variable", function () {
			expect(process.env[normalizedName]).to.be.undefined;
		});

		describe("and then restoring changes", function () {
			before(function () {
				environment.restore();
			});

			it("restores the environment variable", function () {
				expect(process.env[normalizedName]).to.equal(value);
			});
		});
	});

	describe("setting a property", function () {
		var name  = "test";
		var value = "super-awesome-test-value";

		before(function () {
			environment.set(name, value);
		});

		after(function () {
			delete process.env[name];
		});

		it("defines the environment variable", function () {
			expect(process.env[name.toUpperCase()]).to.equal(value);
		});

		describe("and then restoring the changes", function () {
			before(function () {
				environment.restore();
			});

			it("restores the environment variable", function () {
				expect(process.env[name]).to.be.undefined;
			});
		});
	});

	describe("getting a property", function () {
		var name          = "test";
		var normalizeName = name.toUpperCase();
		var value         = "super-awesome-test-value";

		before(function () {
			process.env[normalizeName] = value;
			environment.get(name);
		});

		after(function () {
			delete process.env[normalizeName];
			environment.restore();
		});

		it("returns the property value", function () {
			expect(process.env[normalizeName]).to.equal(value);
		});
	});
});
