"use strict";
var Bluebird = require("bluebird");
var Form     = require("form-urlencoded");

var _ = require("lodash");

function Request (method, path) {
	var options = {
		method : method.toLowerCase(),
		url    : path
	};

	this.header = function (name, value) {
		options.headers = options.headers || {};
		options.headers[name] = value;
		return this;
	};

	this.inject = function (server) {
		if (options.data) {
			if (
				options.headers &&
				"application/x-www-form-urlencoded" === options.headers["content-type"]
			) {
				options.payload = Form.encode(options.data);
			}
			else if (
				options.headers &&
				"application/json" === options.headers["content-type"]
			) {
				options.payload = JSON.stringify(options.data);
			}
			else {
				options.payload = String(options.data);
			}

			delete options.data;
		}

		return new Bluebird(function (resolve) {
			server.inject(options, resolve);
		});
	};

	this.mime = function (type) {
		return this.header("content-type", type);
	};

	this.payload = function (content) {
		if (!_.contains([ "post", "put" ], options.method)) {
			throw new Error("Only POST and PUT requests can have payloads.");
		}

		options.data = content;
		return this;
	};

	this.user = function (username, password) {
		var authorization = "Basic " + (new Buffer(username + ":" + password)).toString("base64");

		this.header("authorization", authorization);
		return this;
	};
}

module.exports = Request;
