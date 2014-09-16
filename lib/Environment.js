"use strict";

function Environment () {
	var changes = [];

	function get (name) {
		return process.env[name];
	}

	function normalizeName (name) {
		return name.toUpperCase();
	}

	function set (name, value) {
		var previousValue = get(name);

		if ("undefined" === typeof value) {
			delete process.env[name];
		}
		else {
			process.env[name] = value;
		}

		return set.bind(null, name, previousValue);
	}

	this.get = function (name) {
		return get(normalizeName(name));
	};

	this.restore = function () {
		var restore = changes.pop();

		while (restore) {
			restore();
			restore = changes.pop();
		}
	};

	this.set = function (name, value) {
		var restore;

		name    = normalizeName(name);
		restore = set(name, value);

		changes.push(restore);
		return restore;
	};
}

module.exports = Environment;
