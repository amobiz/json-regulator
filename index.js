'use strict';

var mixin = require('mixin-deep');
var defaults = require('defaults-deep');

var defaultOptions = { overwrite: true };

function regulate(anyValues, anyPromotions, anyEliminations, anyImmutables, optionalOptions) {
	var assign, eliminations, immutables, options, promotions;

	if (anyEliminations && !isList(anyEliminations)) {
		return regulate(anyValues, anyPromotions, [], [], anyEliminations);
	} else if (anyImmutables && !isList(anyImmutables)) {
		return regulate(anyValues, anyPromotions, anyEliminations, [], anyImmutables);
	}

	promotions = _hashify(anyPromotions);
	eliminations = _hashify(anyEliminations);
	immutables = _hashify(anyImmutables);
	options = defaults(_options(), defaultOptions);
	assign = options.overwrite ? mixin : defaults;
	return _regulate(anyValues);

	function _options() {
		if (isPlainObject(optionalOptions)) {
			return optionalOptions;
		}
		return {};
	}

	function _regulate(values) {
		return _array(values) || _object({}, values) || values;
	}

	function _array(values) {
		if (Array.isArray(values)) {
			return values.map(_regulate);
		}
	}

	function _object(result, values) {
		var keys;

		if (isPlainObject(values)) {
			// process normal properies before promotion properties to ensure overwrite option.
			keys = sort(Object.keys(values), promotions, eliminations);
			result = keys.n.reduce(_normal, result);
			result = keys.p.reduce(_promote, result);
			return result;
		}

		function _normal(ret, key) {
			if (immutables[key]) {
				if (!(key in ret)) {
					ret[key] = values[key];
				}
			} else {
				_assign(ret, key, _regulate(values[key]));
			}
			return ret;
		}

		function _promote(ret, key) {
			var value;

			value = values[key];
			return _object(ret, value) || _assign(ret, key, _array(value) || value);
		}
	}

	function _assign(ret, key, value) {
		var tmp = {};

		tmp[key] = value;
		return assign(ret, tmp);
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

function isList(value) {
	return typeof value === 'string' || Array.isArray(value);
}

function isString(value) {
	return typeof value === 'string';
}

function isPlainObject(value) {
	if (value === null || typeof value !== 'object') {
		return false;
	}
	return Object.getPrototypeOf(value) === Object.prototype;
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
