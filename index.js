'use strict';

var assign = require('mixin-deep');

function regulate(values, promotions, eliminations) {
	promotions = promotions || [];
	eliminations = eliminations || [];
	return _regulate(values);

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
		Object.keys(values).forEach(_property);
		return values;

		function _property(key) {
			var value = values[key];
			_promoted(value) || (values[key] = _regulate(value));

			function _promoted(value) {
				if (includes(promotions, key) && isObject(value)) {
					delete values[key];
					assign(values, _regulate(value));
					return true;
				}
			}
		}
	}

	function _eliminate(values) {
		Object.keys(values).forEach(_property);
		return values;

		function _property(name) {
			_eliminated() || _regulate(values[name]);

			function _eliminated() {
				if (eliminations.indexOf(name) !== -1) {
					delete values[name];
					return true;
				}
			}
		}
	}
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