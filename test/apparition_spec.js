"use strict";
var Apparition = require("..");

var expect = require("chai").expect;

describe("The apparition library", function () {
	it("exposes the environment helper", function () {
		expect(Apparition, "environment")
		.to.have.property("Environment", require("../lib/Environment"));
	});

	it("exposes the properties helper", function () {
		expect(Apparition, "properties")
		.to.have.property("Properties", require("../lib/Properties"));
	});
});
