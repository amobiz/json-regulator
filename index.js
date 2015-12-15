'use strict';

var assign = require('mixin-deep');

function regulate(values, promotions, eliminations) {
	promotions = promotions || [];
	eliminations = eliminations || [];
	return _regulate(values) || values;

	function _regulate(values) {
		if (isObject(values)) {
			return _eliminate(_promote(values));
		}
	}

	function _promote(values) {
		Object.keys(values).forEach(_property);
		return values;

		function _property(key) {
			var value = values[key];
			_promoted() || _regulate(value);

			function _promoted() {
				if (promotions.indexOf(key) !== -1) {
					delete values[key];
					assign(values, _regulate(value) || {});
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

function isObject(target) {
	return !!target && typeof target === 'object' && !Array.isArray(target);
}

module.exports = regulate;