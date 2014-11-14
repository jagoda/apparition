"use strict";
var _          = require("lodash");
var Properties = require("./Properties");

function Environment () {
	Properties.call(this, process.env);
	var properties = _.clone(this);

	function normalizeName (name) {
		return name.toUpperCase();
	}

	this.delete = function (name) {
		return properties.delete.call(this, normalizeName(name));
	};

	this.get = function (name) {
		return properties.get.call(this, normalizeName(name));
	};

	this.set = function (name, value) {
		return properties.set.call(this, normalizeName(name), value);
	};
}

Environment.prototype = Object.create(Properties);

module.exports = Environment;
