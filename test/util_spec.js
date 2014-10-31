"use strict";
var util   = require("../lib/util");
var Lab    = require("lab");
var script = exports.lab = Lab.script();

var before   = script.before;
var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("the util module", function () {
	describe("setValue helper", function () {
		var setValue = util.setValue;

		describe("argument validation", function () {
			it("throws a TypeError if object is not an Object", function (done) {
				expect(function () {
					setValue(null, "test", 4);
				}).to.throw(TypeError, /object must be an Object/);
				done();
			});

			it("throws a TypeError if property is not a String", function (done) {
				expect(function () {
					setValue({}, null, 4);
				}).to.throw(TypeError, /property must be a String/);
				done();
			});

			it("throws a TypeError if value is undefined", function (done) {
				expect(function () {
					setValue({}, "test");
				}).to.throw(TypeError, /value must be defined/);
				done();
			});
		});

		describe("setting a value", function () {
			var originalValue = "original";
			var newValue      = "new";

			var subject = {
				property : originalValue
			};

			var value;

			before(function (done) {
				value = setValue(subject, "property", newValue);
				done();
			});

			it("updates the value", function (done) {
				expect(subject.property, "not updated").to.equal(newValue);
				done();
			});

			it("returns an object", function (done) {
				expect(value).to.be.an("object");
				done();
			});

			describe("return object", function () {
				it("has a restore function", function (done) {
					expect(value, "no restore function").to.have.property("restore");
					expect(value.restore, "not a function").to.be.a("function");
					done();
				});

				describe("restoring the value", function () {
					before(function (done) {
						value.restore();
						done();
					});

					it("restores the original value", function (done) {
						expect(subject.property, "not restored").to.equal(originalValue);
						done();
					});
				});
			});
		});
	});
});