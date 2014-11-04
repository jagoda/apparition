"use strict";

function Properties (subject) {
	var changes = [];

	function get (name) {
		return subject[name];
	}

	function set (name, value) {
		var previousValue = get(name);

		if ("undefined" === typeof value) {
			delete subject[name];
		}
		else {
			subject[name] = value;
		}

		return set.bind(null, name, previousValue);
	}

	this.deleteProperty = function (name) {
		return this.setProperty(name);
	};

	this.getProperty = function (name) {
		return subject[name];
	};

	this.setProperty = function (name, value) {
		var restore;

		restore = set(name, value);

		changes.push(restore);
		return restore;
	};

	this.restore = function () {
		var restore = changes.pop();

		while (restore) {
			restore();
			restore = changes.pop();
		}
	};
}

module.exports = Properties;
