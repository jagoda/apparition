"use strict";
var _          = require("lodash");
var Properties = require("./Properties");

function Environment () {
	Properties.call(this, process.env);
	var properties = _.clone(this);

	function normalizeName (name) {
		return name.toUpperCase();
	}

	function normalizeNames (names) {
		return _.map(names, normalizeName);
	}

	function normalizeKeyNames (values) {
		return _.transform(values, function (result, val, key) {
			result[normalizeName(key)] = val;
			return result;
		});
	}

	this.delete = function (name) {
		return properties.delete.call(this, normalizeName(name));
	};

	this.deleteAll = function (names) {
		return properties.deleteAll.call(this, normalizeNames(names));
	};

	this.get = function (name) {
		return properties.get.call(this, normalizeName(name));
	};

	this.set = function (name, value) {
		return properties.set.call(this, normalizeName(name), value);
	};

	this.setAll = function (values) {
		return properties.setAll.call(this, normalizeKeyNames(values));
	};
}

Environment.prototype = Object.create(Properties.prototype);

Environment.create = function (newEnvironment) {
	var environment = new Environment();
	environment.deleteAll(_.keys(process.env));
	environment.setAll(newEnvironment);
	return environment;
};

Object.freeze(Environment);

module.exports = Environment;
