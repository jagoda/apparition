"use strict";

function Environment () {
	this.get = function (name) {
		return process.env[name.toUpperCase()];
	};
}

module.exports = Environment;
