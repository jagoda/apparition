"use strict";
var apparition  = require("..");
var Lab         = require("lab");
var script      = exports.lab = Lab.script();

var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("the apparition library", function () {
	it("exposes the environment helper", function (done) {
		expect(apparition, "environment")
		.to.have.property("Environment", require("../lib/Environment"));

		done();
	});

	it("exposes the properties helper", function (done) {
		expect(apparition, "properties")
		.to.have.property("Properties", require("../lib/Properties"));

		done();
	});
});
