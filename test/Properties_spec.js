"use strict";
var Properties = require("../lib/Properties");

var expect = require("chai").expect;
var _      = require("lodash");

describe("Properties", function () {
	function describeDelete (context) {
		before(function () {
			context.originalValue = context.properties.get(context.name);
			context.result        = context.properties.delete(context.name);
		});

		it("unsets the value", function () {
			expect(context.properties.get(context.name), "value").to.be.undefined;
		});

		describeRestoreFunction(context);
	}

	function describeDeleteAll (context) {
		before(function () {
			context.originalValues = _.pick(context.properties, context.names);
			context.result         = context.properties.deleteAll(context.names);
		});

		it("sets the values", function () {
			_.forEach(context.names, function (key) {
				expect(context.properties.get(key), "value of " + key).to.be.undefined;
			});
		});

		describeRestoreAllFunction(context, true);
	}

	function describeRestoreFunction (context) {
		it("returns a 'restore' function", function () {
			expect(context.result, "type").to.be.a("function");
		});

		describe("and invoking the restore function", function () {
			var restore;

			before(function () {
				restore = context.result();
			});

			after(function () {
				restore();
			});

			it("undoes the set operation", function () {
				expect(context.properties.get(context.name), "value")
				.to.equal(context.originalValue);
			});
		});
	}

	function describeRestoreAllFunction (context, isDeleteOperation) {
		it("returns a 'restoreAll' function", function () {
			expect(context.result, "type").to.be.a("function");
		});

		describe("and invoking the restore function", function () {
			before(function () {
				context.revert = context.result();
			});

			it("undoes multiple set operations", function () {
				_.forEach(context.originalValues, function (value, key) {
					expect(context.properties.get(key), "value of " + key).to.equal(value);
				});
			});

			// batch operations' reversion function is more complicated, so test it too
			describeRestoreAllRevertFunction(context, isDeleteOperation);
		});
	}

	function describeRestoreAllRevertFunction (context, isDeleteOperation) {
		it("returns a revert function after restoring", function () {
			expect(context.revert, "type").to.be.a("function");
		});

		describe("and invoking the revert function", function () {
			before(function () {
				context.revert();
			});

			if (isDeleteOperation) {
				it("redoes multiple delete operations", function () {
					_.forEach(context.names, function (name) {
						expect(context.properties.get(name), "value of " + name).to.be.undefined;
					});
				});
			}
			else {
				it("redoes multiple set operations", function () {
					_.forEach(context.values, function (value, key) {
						expect(context.properties.get(key), "value of " + key).to.equal(value);
					});
				});
			}
		});
	}

	function describeSet (context) {
		before(function () {
			context.originalValue = context.properties.get(context.name);
			context.result        = context.properties.set(context.name, context.value);
		});

		it("sets the value", function () {
			expect(context.properties.get(context.name), "value").to.equal(context.value);
		});

		describeRestoreFunction(context);
	}

	function describeSetAll (context) {
		before(function () {
			context.originalValues = _.pick(context.properties, _.keys(context.values));
			context.result         = context.properties.setAll(context.values);
		});

		it("sets the values", function () {
			_.forEach(context.values, function (value, key) {
				expect(context.properties.get(key), "value of " + key).to.equal(value);
			});
		});

		describeRestoreAllFunction(context);
	}

	describe("retrieving a property that is not defined", function () {
		var result;

		before(function () {
			var properties = new Properties({});

			result = properties.get("foo");
		});

		it("returns 'undefined'", function () {
			expect(result, "result").to.be.undefined;
		});
	});

	describe("retrieving a property that is defined", function () {
		var result;

		before(function () {
			var properties = new Properties({
				foo : "bar"
			});

			result  = properties.get("foo");
		});

		it("returns the value", function () {
			expect(result, "result").to.equal("bar");
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

		before(function () {
			bar = properties.get("bar");
			foo = properties.get("foo");

			properties.set("bar", "bar");
			properties.delete("foo");
			properties.restore();
		});

		it("reverts all changes to the properties", function () {
			expect(properties.get("bar"), "bar").to.equal(bar);
			expect(properties.get("foo"), "foo").to.equal(foo);
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

		before(function () {
			properties.set("single", "new value");
			properties.setAll({ multiA : "a2", multiB : "b2" });
			properties.delete("multiA");
			properties.restore();
		});

		it("reverts all changes to the properties", function () {
			expect(properties.get("single"), "single value").to.equal(single);
			expect(properties.get("multiA"), "multiple value A").to.equal(multiA);
			expect(properties.get("multiB"), "multiple value B").to.equal(multiB);
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

		before(function () {
			properties.setAll({ multiA1 : "x", multiA2 : "x" });
			properties.deleteAll([ "multiB1", "multiB2" ]);
			properties.setAll({ multiB1 : "x", multiB2 : "x" });
			properties.restore();
		});

		it("reverts all changes to the properties", function () {
			expect(properties.get("multiA1"), "multiple value A 1").to.equal(multiA1);
			expect(properties.get("multiA2"), "multiple value A 1").to.equal(multiA2);
			expect(properties.get("multiB1"), "multiple value A 1").to.equal(multiB1);
			expect(properties.get("multiB2"), "multiple value A 1").to.equal(multiB2);
		});
	});

	describe("restoring all changes after calling an individual restore function", function () {
		var bar = "bar";
		var properties = new Properties({});

		before(function () {
			var individualRestore = properties.set("bar", bar);
			individualRestore();
			properties.restore();
		});

		it("reverts all changes to the properties", function () {
			expect(properties.get("bar"), "bar").to.be.undefined;
		});
	});

	describe("restoring all changes after calling a batch set restore function", function () {
		var multiA = "a";
		var multiB = "b";

		var properties = new Properties({});

		before(function () {
			var batchRestore = properties.setAll({ multiA : multiA, multiB : multiB });
			batchRestore();
			properties.restore();
		});

		it("reverts all changes to the properties", function () {
			expect(properties.get("multiA"), "multiA").to.be.undefined;
			expect(properties.get("multiB"), "multiB").to.be.undefined;
		});
	});

	describe("restoring all changes after calling a batch delete function", function () {
		var multiA = "a";
		var multiB = "b";

		var properties = new Properties({ multiA : "a", multiB : "b" });

		before(function () {
			var batchRestore = properties.deleteAll([ "multiA", "multiB" ]);
			batchRestore();
			properties.restore();
		});

		it("reverts all changes to the properties", function () {
			expect(properties.get("multiA"), "multiA").to.equal(multiA);
			expect(properties.get("multiB"), "multiB").to.equal(multiB);
		});
	});
});
