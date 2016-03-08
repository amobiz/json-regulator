## json-regulator changelog

### 2016/03/08 - 0.1.16

* Bug Fix: Avoid processing non plain objects, e.g. RegExp()s, functions.

### 2016/01/09 - 0.1.15

* Feature: Add `immutables` parameter. See test for examples.

### 2016/01/02 - 0.1.14

* Feature: Add `overwrite` option.
* Bug Fix: Process normal properies before `promotions` properties to ensure `overwrite` option.

### 2015/12/24 - 0.1.10

* NPM: Update npm settings.

### 2015/12/18 - 0.1.9

* Feature: Also process objects inside array values recursively.
* Feature: Parameter `promotions` and `eliminations` now can be `string` or `array` of strings.
* Enhance: Returns a new JSON value object, the input values is immutable now.

### 2015/12/15 - 0.1.0

* First release.
