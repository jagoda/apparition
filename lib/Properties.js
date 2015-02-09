"use strict";
var _ = require("lodash");

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

	function restoreAll (changeSet) {
		var restore = changeSet.pop();
		var revertChangeSet = [];

		while (restore) {
			revertChangeSet.push(restore());
			restore = changeSet.pop();
		}

		return restoreAll.bind(null, revertChangeSet);
	}

	this.delete = function (name) {
		return this.set(name);
	};

	this.deleteAll = function (names) {
		var self = this;
		var restores = _.map(names, function (name) {
			self.set(name);
		});
		return function () {
			return restoreAll(restores);
		};
	};

	this.get = function (name) {
		return subject[name];
	};

	this.set = function (name, value) {
		var restore;

		restore = set(name, value);

		changes.push(restore);
		return restore;
	};

	this.setAll = function (sets) {
		var self = this;
		var restores = _.map(
			sets,
			function (value, key) {
				return self.set(key, value);
			}
		);

		return function () {
			return restoreAll(restores);
		};
	};

	this.restore = function () {
		restoreAll(changes);
	};
}

module.exports = Properties;
