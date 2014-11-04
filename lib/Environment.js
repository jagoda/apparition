"use strict";
var Properties = require("./Properties");

function Environment () {
	Properties.call(this, process.env);

	function normalizeName (name) {
		return name.toUpperCase();
	}

	this.delete = function (name) {
		return this.deleteProperty(normalizeName(name));
	};

	this.get = function (name) {
		return this.getProperty(normalizeName(name));
	};

	this.set = function (name, value) {
		return this.setProperty(normalizeName(name), value);
	};
}

Environment.prototype = Object.create(Properties);

module.exports = Environment;
