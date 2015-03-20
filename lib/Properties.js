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

	function restoreAll (changes) {
		var revert = [];
		var restore;

		for (restore = changes.pop(); restore; restore = changes.pop()) {
			revert.push(restore());
		}

		return restoreAll.bind(null, revert);
	}

	this.delete = function (name) {
		return this.set(name);
	};

	this.get = get;

	this.set = function (name, value) {
		changes.push(set(name, value));
		return this;
	};

	this.restore = function () {
		restoreAll(changes);
		return this;
	};
}

module.exports = Properties;
