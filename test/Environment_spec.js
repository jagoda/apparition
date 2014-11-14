"use strict";
var Environment = require("../lib/Environment");
var Lab         = require("lab");
var script      = exports.lab = Lab.script();

var before   = script.before;
var after    = script.after;
var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("an Environment", function () {
	var environment;

	before(function (done) {
		environment = new Environment();
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