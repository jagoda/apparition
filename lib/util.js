"use strict";
var _ = require("lodash");

module.exports = {
	setValue : function (object, property, value) {
		if (!_.isObject(object)) {
			throw new TypeError("object must be an Object");
		}

		if (!_.isString(property)) {
			throw new TypeError("property must be a String");
		}

		if (_.isUndefined(value)) {
			throw new TypeError("value must be defined");
		}

		var old = object[property];
		object[property] = value;

		return {
			restore : function () {
				object[property] = old;
			}
		};
	}
};
