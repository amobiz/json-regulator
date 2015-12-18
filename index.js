'use strict';

var assign = require('mixin-deep');

function regulate(anyValues, anyPromotions, anyEliminations) {
	var eliminations, promotions;

	promotions = _arrayify(anyPromotions);
	eliminations = _arrayify(anyEliminations);
	return _regulate(anyValues);

	function _regulate(values) {
		if (Array.isArray(values)) {
			return values.map(_regulate);
		}
		if (isObject(values)) {
			return _eliminate(_promote(values));
		}
		return values;
	}

	function _promote(values) {
		return _each(values, __promote);

		function __promote(value, key, result) {
			if (includes(promotions, key) && isObject(value)) {
				assign(result, _regulate(value));
				return true;
			}
		}
	}

	function _eliminate(values) {
		return _each(values, __eliminate);

		function __eliminate(value, key) {
			return includes(eliminations, key);
		}
	}

	function _each(values, fn) {
		return Object.keys(values).reduce(_property, {});

		function _property(result, key) {
			var value;

			value = values[key];
			if (!fn(value, key, result)) {
				(result[key] = _regulate(value));
			}
			return result;
		}
	}
}

function _arrayify(value) {
	if (Array.isArray(value)) {
		return value;
	}
	if (isString(value)) {
		return [value];
	}
	return [];
}

function isString(value) {
	return typeof value === 'string';
}

function isObject(value) {
	return !!value && typeof value === 'object' && !Array.isArray(value);
}

function includes(array, value) {
	return array.indexOf(value) !== -1;
}

module.exports = regulate;
