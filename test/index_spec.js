"use strict";
var Lab    = require("lab");
var script = exports.lab = Lab.script();
var whisp  = require("..");

var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("the whisp library", function () {
	it("exposes the environment helper", function (done) {
		expect(whisp, "environment").to.have.property("Environment");
		done();
	});
});
