'use strict';

var mixin = require('mixin-deep');
var defaults = require('defaults-deep');

var defaultOptions = { overwrite: true };

function regulate(anyValues, anyPromotions, anyEliminations, optionalOptions) {
	var eliminations, promotions, options, assign;

	promotions = _hashify(anyPromotions);
	eliminations = _hashify(anyEliminations);
	options = defaults(_options(), defaultOptions);
	assign = options.overwrite ? mixin : defaults;
	return _regulate(anyValues);

	function _options() {
		if (optionalOptions) {
			return optionalOptions;
		}
		if (anyEliminations && typeof anyEliminations === 'object' && !Array.isArray(anyEliminations)) {
			return anyEliminations;
		}
		return {};
	}

	function _regulate(values) {
		if (Array.isArray(values)) {
			return values.map(_regulate);
		}
		if (isObject(values)) {
			return _object(values);
		}
		return values;
	}

	function _object(values) {
		var keys, result;

		// process normal properies before promotion properties to ensure overwrite option.
		keys = sort(Object.keys(values), promotions, eliminations);
		result = keys.n.reduce(_normal, {});
		result = keys.p.reduce(_promote, result);
		return result;

		function _normal(ret, key) {
			ret[key] = _regulate(values[key]);
			return ret;
		}

		function _promote(ret, key) {
			var value;

			value = values[key];
			if (isObject(value)) {
				return assign(ret, _regulate(value));
			}
			result[key] = value;
			return result;
		}
	}
}

function _hashify(value) {
	var result;

	result = {};
	if (Array.isArray(value)) {
		result = value.reduce(function (ret, key) {
			ret[key] = true;
			return ret;
		}, result);
	} else if (isString(value)) {
		result[value] = true;
	}
	return result;
}

function isString(value) {
	return typeof value === 'string';
}

function isObject(value) {
	return !!value && typeof value === 'object' && !Array.isArray(value);
}

function sort(keys, promotions, eliminations) {
	var i, n, key, ret;

	ret = {
		p: [],
		n: []
	};
	for (i = 0, n = keys.length; i < n; ++i) {
		key = keys[i];
		if (promotions[key]) {
			ret.p.push(key);
		} else if (!eliminations[key]) {
			ret.n.push(key);
		}
	}
	return ret;
}

module.exports = regulate;
