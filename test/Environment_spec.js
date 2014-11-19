"use strict";
var Environment = require("../lib/Environment");
var Properties  = require("../lib/Properties");
var Lab         = require("lab");
var script      = exports.lab = Lab.script();

var before   = script.before;
var after    = script.after;
var describe = script.describe;
var expect   = Lab.expect;
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
			expect(process.env[name]).to.be.undefined;
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

		it("deletes the property", function (done) {
			expect(process.env[name.toUpperCase()]).to.equal(value);
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
});