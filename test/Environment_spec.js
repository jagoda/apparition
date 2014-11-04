"use strict";
var Environment = require("../lib/Environment");
var Lab         = require("lab");
var script      = exports.lab = Lab.script();
var sinon       = require("sinon");

var before   = script.before;
var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

function normalizeName (name) {
	return name.toUpperCase();
}

describe("an Environment", function () {
	var environment;

	before(function (done) {
		environment = new Environment();
		done();
	});

	describe("deleting a property", function () {
		var deleteProperty;
		var name = "test";

		before(function (done) {
			deleteProperty = sinon.stub(environment, "deleteProperty");
			environment.delete(name);
			done();
		});

		it("deletes the property", function (done) {
			expect(deleteProperty.calledOnce, "not called").to.be.true;
			expect(deleteProperty.calledWith(normalizeName(name)), "wrong args").to.be.true;
			done();
		});
	});

	describe("setting a property", function () {
		var setProperty;
		var name = "test";
		var value = "val";

		before(function (done) {
			setProperty = sinon.stub(environment, "setProperty");
			environment.set(name, value);
			done();
		});

		it("sets the property", function (done) {
			expect(setProperty.calledOnce, "not called").to.be.true;
			expect(setProperty.calledWith(normalizeName(name), value), "wrong args").to.be.true;
			done();
		});
	});

	describe("getting a property", function () {
		var getProperty;
		var name = "test";

		before(function (done) {
			getProperty = sinon.stub(environment, "getProperty");
			environment.get(name);
			done();
		});

		it("gets the property", function (done) {
			expect(getProperty.calledOnce, "not called").to.be.true;
			expect(getProperty.calledWith(normalizeName(name)), "wrong args").to.be.true;
			done();
		});
	});
});