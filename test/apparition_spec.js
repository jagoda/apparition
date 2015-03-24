"use strict";
var Apparition = require("..");

var expect = require("chai").expect;

describe("The Apparition library", function () {
	it("exposes the environment helper", function () {
		expect(Apparition, "environment")
		.to.have.property("Environment", require("../lib/Environment"));
	});

	it("exposes the properties helper", function () {
		expect(Apparition, "properties")
		.to.have.property("Properties", require("../lib/Properties"));
	});

	it("exposes the request helper", function () {
		expect(Apparition, "request")
		.to.have.property("Request", require("../lib/Request"));
	});
});
