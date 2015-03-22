"use strict";
var Hapi    = require("hapi");
var Request = require("../lib/Request");

var expect = require("chai").expect;
var _      = require("lodash");

describe("A Request helper", function () {
	var server = new Hapi.Server();

	server.connection();

	server.route({
		method : [ "get", "post", "put" ],
		path   : "/{p*}",

		handler : function (request, reply) {
			reply(_.pick(request, "headers", "payload", "url"));
		}
	});

	describe("injecting a request into a server instance", function () {
		var response;

		before(function () {
			var request = new Request("get", "/some/path");

			return request.inject(server)
			.then(function (data) {
				response = data;
			});
		});

		it("uses the server to process the request", function () {
			expect(response.result.url.path, "path").to.equal("/some/path");
		});
	});

	describe("defining a header value", function () {
		var response;

		before(function () {
			var request = new Request("get", "/").header("foo", "bar");

			return request.inject(server)
			.then(function (data) {
				response = data;
			});
		});

		it("sends the header to the server", function () {
			expect(response.result.headers.foo, "header").to.equal("bar");
		});
	});

	describe("defining the content type", function () {
		var response;

		before(function () {
			var request = new Request("get", "/").mime("application/json");

			return request.inject(server)
			.then(function (data) {
				response = data;
			});
		});

		it("sets the 'Content-Type' header", function () {
			expect(response.result.headers["content-type"], "header").to.equal("application/json");
		});
	});

	describe("defining a request payload", function () {
		var payload = { foo : "bar" };

		describe("without a content type", function () {
			var response;

			before(function () {
				var request = new Request("post", "/").payload(payload);

				return request.inject(server)
				.then(function (data) {
					response = data;
				});
			});

			it("sends a generic request payload", function () {
				expect(response.result.headers["content-type"], "headers").not.to.exist;
				expect(response.result.payload, "payload").to.deep.equal(payload);
			});
		});

		describe("with the JSON content type", function () {
			var response;

			before(function () {
				var request = new Request("put", "/").mime("application/json").payload(payload);

				return request.inject(server)
				.then(function (data) {
					response = data;
				});
			});

			it("sends a JSON request payload", function () {
				expect(response.result.headers["content-type"], "headers")
				.to.equal("application/json");

				expect(response.result.payload, "payload").to.deep.equal(payload);
			});
		});

		describe("with the form content type", function () {
			var response;

			before(function () {
				var request = new Request("POST", "/")
				.mime("application/x-www-form-urlencoded")
				.payload(payload);

				return request.inject(server)
				.then(function (data) {
					response = data;
				});
			});

			it("sends a form encoded request payload", function () {
				expect(response.result.headers["content-type"], "header")
				.to.equal("application/x-www-form-urlencoded");

				expect(response.result.payload, "payload").to.deep.equal(payload);
			});
		});

		describe("when the content type is defined after the payload", function () {
			var response;

			before(function () {
				var request = new Request("put", "/")
				.payload(payload)
				.mime("application/x-www-form-urlencoded");

				return request.inject(server)
				.then(function (data) {
					response = data;
				});
			});

			it("correctly encodes the request payload", function () {
				expect(response.result.headers["content-type"], "header")
				.to.equal("application/x-www-form-urlencoded");

				expect(response.result.payload, "payload").to.deep.equal(payload);
			});
		});

		describe("for an invalid request method", function () {
			it("fails to set the payload", function () {
				var request = new Request("get", "/");

				expect(function () {
					request.payload({});
				}, "error").to.throw(/post and put/i);
			});
		});
	});

	describe("defining a user credential", function () {
		var password = "bar";
		var username = "foo";

		var authorization = "Basic " + (new Buffer(username + ":" + password)).toString("base64");

		var response;

		before(function () {
			var request = new Request("get", "/").user(username, password);

			return request.inject(server)
			.then(function (data) {
				response = data;
			});
		});

		it("creates an HTTP Basic Auth header", function () {
			expect(response.result.headers.authorization, "header").to.equal(authorization);
		});
	});
});
