"use strict";
var Code        = require("code");
var Environment = require("../lib/Environment");
var Properties  = require("../lib/Properties");
var Lab         = require("lab");
var script      = exports.lab = Lab.script();
var _           = require("lodash");

var before   = script.before;
var after    = script.after;
var describe = script.describe;
var expect   = Code.expect;
var it       = script.it;

describe("an Environment", function () {
	var environment;
	var env;

	before(function (done) {
		env = process.env;
		process.env = {};
		environment = new Environment();
		done();
	});

	after(function (done) {
		process.env = env;
		done();
	});

	it("is a Properties", function (done) {
		expect(environment, "not a Properties").to.be.an.instanceof(Properties);
		done();
	});

	it("has a static create function", function (done) {
		expect(Environment.create, "no create function").to.be.a.function();
		done();
	});

	it("has constant static properties", function (done) {
		expect(Object.isFrozen(Environment), "frozen").to.be.true();
		done();
	});

	describe("deleting a property", function () {
		var name  = "test";
		var value = "super-awesome-test-value";

		before(function (done) {
			process.env[name.toUpperCase()] = value;
			environment.delete(name);
			done();
		});

		after(function (done) {
			environment.restore();
			delete process.env[name.toUpperCase()];
			done();
		});

		it("deletes the property", function (done) {
			expect(process.env[name]).to.be.undefined();
			done();
		});
	});

	describe("deleting multiple properties", function () {
		var names = [ "foo", "bar" ];
		var value = "super-awesome-test-value";

		before(function (done) {
			names.forEach(function (name) {
				process.env[name.toUpperCase()] = value;
			});

			environment.deleteAll(names);
			done();
		});

		after(function (done) {
			environment.restore();
			names.forEach(function (name) {
				delete process.env[name.toUpperCase()];
			});
			done();
		});

		it("deletes the properties", function (done) {
			names.forEach(function (name) {
				expect(process.env[name.toUpperCase()]).to.be.undefined();
			});
			done();
		});
	});

	describe("setting a property", function () {
		var name  = "test";
		var value = "super-awesome-test-value";

		before(function (done) {
			environment.set(name, value);
			done();
		});

		after(function (done) {
			environment.restore();
			done();
		});

		it("sets the property", function (done) {
			expect(process.env[name.toUpperCase()]).to.equal(value);
			done();
		});
	});

	describe("setting multiple properties", function () {
		var values = {
			foo : "foo",
			bar : "bar"
		};

		before(function (done) {
			environment.setAll(values);
			done();
		});

		after(function (done) {
			environment.restore();
			done();
		});

		it("sets the properties", function (done) {
			_.forEach(values, function (value, key) {
				expect(process.env[key.toUpperCase()]).to.equal(value);
			});
			done();
		});
	});

	describe("getting a property", function () {
		var name  = "test";
		var value = "super-awesome-test-value";

		before(function (done) {
			process.env[name.toUpperCase()] = value;
			environment.get(name);
			done();
		});

		after(function (done) {
			delete process.env[name.toUpperCase()];
			environment.restore();
			done();
		});

		it("deletes the property", function (done) {
			expect(process.env[name.toUpperCase()]).to.equal(value);
			done();
		});
	});

	describe("creating an environment from a hash", function () {
		var values = {
			foo : "foo",
			bar : "bar"
		};

		var environment;

		before(function (done) {
			process.env.BAZ = "unwanted value";
			process.env.FOO = "overwritten value";

			environment = Environment.create(values);
			done();
		});

		after(function (done) {
			environment.restore();
			done();
		});

		it("sets the provided properties", function (done) {
			_.forEach(values, function (value, key) {
				expect(process.env[key.toUpperCase()]).to.equal(value);
			});
			done();
		});

		it("unsets extra properties", function (done) {
			expect(process.env.BAZ, "extra value").to.be.undefined();
			done();
		});
	});
});