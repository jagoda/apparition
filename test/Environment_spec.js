"use strict";
var Environment = require("../lib/Environment");
var Properties  = require("../lib/Properties");

var expect = require("chai").expect;
var _      = require("lodash");

describe("An Environment", function () {
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
		var name  = "test";
		var value = "super-awesome-test-value";

		before(function () {
			process.env[name.toUpperCase()] = value;
			environment.delete(name);
		});

		after(function () {
			environment.restore();
			delete process.env[name.toUpperCase()];
		});

		it("deletes the property", function () {
			expect(process.env[name]).to.be.undefined;
		});
	});

	describe("deleting multiple properties", function () {
		var names = [ "foo", "bar" ];
		var value = "super-awesome-test-value";

		before(function () {
			names.forEach(function (name) {
				process.env[name.toUpperCase()] = value;
			});

			environment.deleteAll(names);
		});

		after(function () {
			environment.restore();
			names.forEach(function (name) {
				delete process.env[name.toUpperCase()];
			});
		});

		it("deletes the properties", function () {
			names.forEach(function (name) {
				expect(process.env[name.toUpperCase()]).to.be.undefined;
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
			environment.restore();
		});

		it("sets the property", function () {
			expect(process.env[name.toUpperCase()]).to.equal(value);
		});
	});

	describe("setting multiple properties", function () {
		var values = {
			foo : "foo",
			bar : "bar"
		};

		before(function () {
			environment.setAll(values);
		});

		after(function () {
			environment.restore();
		});

		it("sets the properties", function () {
			_.forEach(values, function (value, key) {
				expect(process.env[key.toUpperCase()]).to.equal(value);
			});
		});
	});

	describe("getting a property", function () {
		var name  = "test";
		var value = "super-awesome-test-value";

		before(function () {
			process.env[name.toUpperCase()] = value;
			environment.get(name);
		});

		after(function () {
			delete process.env[name.toUpperCase()];
			environment.restore();
		});

		it("deletes the property", function () {
			expect(process.env[name.toUpperCase()]).to.equal(value);
		});
	});

	describe("creating an environment from a hash", function () {
		var values = {
			foo : "foo",
			bar : "bar"
		};

		var environment;

		before(function () {
			process.env.BAZ = "unwanted value";
			process.env.FOO = "overwritten value";

			environment = Environment.create(values);
		});

		after(function () {
			environment.restore();
		});

		it("sets the provided properties", function () {
			_.forEach(values, function (value, key) {
				expect(process.env[key.toUpperCase()]).to.equal(value);
			});
		});

		it("unsets extra properties", function () {
			expect(process.env.BAZ, "extra value").to.be.undefined;
		});
	});
});
