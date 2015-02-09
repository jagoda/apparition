"use strict";
var Code       = require("code");
var Properties = require("../lib/Properties");
var Lab        = require("lab");
var script     = exports.lab = Lab.script();
var _          = require("lodash");

var after    = script.after;
var before   = script.before;
var describe = script.describe;
var expect   = Code.expect;
var it       = script.it;

describe("Properties", function () {
	function describeDelete (context) {
		before(function (done) {
			context.originalValue = context.properties.get(context.name);
			context.result        = context.properties.delete(context.name);
			done();
		});

		it("unsets the value", function (done) {
			expect(context.properties.get(context.name), "value").to.be.undefined();
			done();
		});

		describeRestoreFunction(context);
	}

	function describeDeleteAll (context) {
		before(function (done) {
			context.originalValues = _.pick(context.properties, context.names);
			context.result         = context.properties.deleteAll(context.names);
			done();
		});

		it("sets the values", function (done) {
			_.forEach(context.names, function (key) {
				expect(context.properties.get(key), "value of " + key).to.be.undefined;
			});
			done();
		});

		describeRestoreAllFunction(context, true);
	}

	function describeRestoreFunction (context) {
		it("returns a 'restore' function", function (done) {
			expect(context.result, "type").to.be.a.function();
			done();
		});

		describe("and invoking the restore function", function () {
			var restore;

			before(function (done) {
				restore = context.result();
				done();
			});

			after(function (done) {
				restore();
				done();
			});

			it("undoes the set operation", function (done) {
				expect(context.properties.get(context.name), "value")
				.to.equal(context.originalValue);

				done();
			});
		});
	}

	function describeRestoreAllFunction (context, isDeleteOperation) {
		it("returns a 'restoreAll' function", function (done) {
			expect(context.result, "type").to.be.a("function");
			done();
		});

		describe("and invoking the restore function", function () {
			before(function (done) {
				context.revert = context.result();
				done();
			});

			it("undoes multiple set operations", function (done) {
				_.forEach(context.originalValues, function (value, key) {
					expect(context.properties.get(key), "value of " + key).to.equal(value);
				});

				done();
			});

			// batch operations' reversion function is more complicated, so test it too
			describeRestoreAllRevertFunction(context, isDeleteOperation);
		});
	}

	function describeRestoreAllRevertFunction (context, isDeleteOperation) {
		it("returns a revert function after restoring", function (done) {
			expect(context.revert, "type").to.be.a("function");
			done();
		});

		describe("and invoking the revert function", function () {
			before(function (done) {
				context.revert();
				done();
			});

			if (isDeleteOperation) {
				it("redoes multiple delete operations", function (done) {
					_.forEach(context.names, function (name) {
						expect(context.properties.get(name), "value of " + name).to.be.undefined;
					});

					done();
				});
			}
			else {
				it("redoes multiple set operations", function (done) {
					_.forEach(context.values, function (value, key) {
						expect(context.properties.get(key), "value of " + key).to.equal(value);
					});

					done();
				});
			}
		});
	}

	function describeSet (context) {
		before(function (done) {
			context.originalValue = context.properties.get(context.name);
			context.result        = context.properties.set(context.name, context.value);
			done();
		});

		it("sets the value", function (done) {
			expect(context.properties.get(context.name), "value").to.equal(context.value);
			done();
		});

		describeRestoreFunction(context);
	}

	function describeSetAll (context) {
		before(function (done) {
			context.originalValues = _.pick(context.properties, _.keys(context.values));
			context.result         = context.properties.setAll(context.values);
			done();
		});

		it("sets the values", function (done) {
			_.forEach(context.values, function (value, key) {
				expect(context.properties.get(key), "value of " + key).to.equal(value);
			});
			done();
		});

		describeRestoreAllFunction(context);
	}

	describe("retrieving a property that is not defined", function () {
		var result;

		before(function (done) {
			var properties = new Properties({});

			result = properties.get("foo");
			done();
		});

		it("returns 'undefined'", function (done) {
			expect(result, "result").to.be.undefined();
			done();
		});
	});

	describe("retrieving a property that is defined", function () {
		var result;

		before(function (done) {
			var properties = new Properties({
				foo : "bar"
			});

			result  = properties.get("foo");
			done();
		});

		it("returns the value", function (done) {
			expect(result, "result").to.equal("bar");
			done();
		});
	});

	describe("setting a property that is not defined", function () {
		var context = {
			properties : new Properties({}),
			name       : "foo",
			value      : "bar"
		};

		describeSet(context);
	});

	describe("setting a property that is already defined", function () {
		var context = {
			properties : new Properties({
				foo : "bar"
			}),
			name       : "foo",
			value      : "bar"
		};

		describeSet(context);
	});

	describe("setting multiple properties that are not defined", function () {
		var context = {
			properties : new Properties({}),
			values     : { foo : "foo", bar : "bar" }
		};

		describeSetAll(context);
	});

	describe("setting multiple properties that are defined and not defined", function () {
		var context = {
			properties : new Properties({
				foo : "foo"
			}),

			values : { foo : "foo2", bar : "bar" }
		};

		describeSetAll(context);
	});

	describe("setting multiple properties that are all defined", function () {
		var context = {
			properties : new Properties({
				foo : "foo",
				bar : "bar"
			}),

			values : { foo : "foo2", bar : "bar2" }
		};

		describeSetAll(context);
	});

	describe("deleting a property that is not defined", function () {
		var context = {
			properties : new Properties({}),
			name       : "foo"
		};

		describeDelete(context);
	});

	describe("deleting a property that is defined", function () {
		var context = {
			properties : new Properties({
				foo : "foo"
			}),
			name       : "foo"
		};

		describeDelete(context);
	});

	describe("deleting multiple properties that are not defined", function () {
		var context = {
			properties : new Properties({}),
			names      : [ "foo", "bar" ]
		};

		describeDeleteAll(context);
	});

	describe("deleting multiple properties that are defined and not defined", function () {
		var context = {
			properties : new Properties({
				foo : "foo"
			}),

			names : [ "foo", "bar" ]
		};

		describeDeleteAll(context);
	});

	describe("deleting multiple properties that are all defined", function () {
		var context = {
			properties : new Properties({
				foo : "foo",
				bar : "bar"
			}),

			names : [ "foo", "bar" ]
		};

		describeDeleteAll(context);
	});

	describe("restoring multiple single-value changes", function () {
		var properties = new Properties({});

		var bar;
		var foo;

		before(function (done) {
			bar = properties.get("bar");
			foo = properties.get("foo");

			properties.set("bar", "bar");
			properties.delete("foo");
			properties.restore();
			done();
		});

		it("reverts all changes to the properties", function (done) {
			expect(properties.get("bar"), "bar").to.equal(bar);
			expect(properties.get("foo"), "foo").to.equal(foo);
			done();
		});
	});

	describe("restoring single- and multi-value changes", function () {
		var single = "single value";
		var multiA = "a";
		var multiB = "b";

		var properties = new Properties({
			single : single,
			multiA : multiA,
			multiB : multiB
		});

		before(function (done) {
			properties.set("single", "new value");
			properties.setAll({ multiA : "a2", multiB : "b2" });
			properties.delete("multiA");
			properties.restore();
			done();
		});

		it("reverts all changes to the properties", function (done) {
			expect(properties.get("single"), "single value").to.equal(single);
			expect(properties.get("multiA"), "multiple value A").to.equal(multiA);
			expect(properties.get("multiB"), "multiple value B").to.equal(multiB);
			done();
		});
	});

	describe("restoring multi-value changes", function () {
		var multiA1 = "a1";
		var multiA2 = "a2";
		var multiB1 = "b1";
		var multiB2 = "b2";

		var properties = new Properties({
			multiA1 : multiA1,
			multiA2 : multiA2,
			multiB1 : multiB1,
			multiB2 : multiB2
		});

		before(function (done) {
			properties.setAll({ multiA1 : "x", multiA2 : "x" });
			properties.deleteAll([ "multiB1", "multiB2" ]);
			properties.setAll({ multiB1 : "x", multiB2 : "x" });
			properties.restore();
			done();
		});

		it("reverts all changes to the properties", function (done) {
			expect(properties.get("multiA1"), "multiple value A 1").to.equal(multiA1);
			expect(properties.get("multiA2"), "multiple value A 1").to.equal(multiA2);
			expect(properties.get("multiB1"), "multiple value A 1").to.equal(multiB1);
			expect(properties.get("multiB2"), "multiple value A 1").to.equal(multiB2);
			done();
		});
	});

	describe("restoring all changes after calling an individual restore function", function () {
		var bar = "bar";
		var properties = new Properties({});

		before(function (done) {
			var individualRestore = properties.set("bar", bar);
			individualRestore();
			properties.restore();
			done();
		});

		it("reverts all changes to the properties", function (done) {
			expect(properties.get("bar"), "bar").to.be.undefined;
			done();
		});
	});

	describe("restoring all changes after calling a batch set restore function", function () {
		var multiA = "a";
		var multiB = "b";

		var properties = new Properties({});

		before(function (done) {
			var batchRestore = properties.setAll({ multiA : multiA, multiB : multiB });
			batchRestore();
			properties.restore();
			done();
		});

		it("reverts all changes to the properties", function (done) {
			expect(properties.get("multiA"), "multiA").to.be.undefined;
			expect(properties.get("multiB"), "multiB").to.be.undefined;
			done();
		});
	});

	describe("restoring all changes after calling a batch delete function", function () {
		var multiA = "a";
		var multiB = "b";

		var properties = new Properties({ multiA : "a", multiB : "b" });

		before(function (done) {
			var batchRestore = properties.deleteAll([ "multiA", "multiB" ]);
			batchRestore();
			properties.restore();
			done();
		});

		it("reverts all changes to the properties", function (done) {
			expect(properties.get("multiA"), "multiA").to.equal(multiA);
			expect(properties.get("multiB"), "multiB").to.equal(multiB);
			done();
		});
	});
});
