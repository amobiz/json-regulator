# json-regulator
Promote and/or eliminate specified properties of a JSON value.

## Install
```
npm install json-regulator
```

## API

### `regulate(values, promotions, eliminations)`
For given JSON values object, promote keys in promotions array up one level and eliminate keys in promotions and eliminations array.
#### Context
Don't care.
#### Parameters
##### `values`
The object needs to regulate.
##### `promotions`
An array of keys to promote.
##### `eliminations`
An array of keys to eliminate.
#### Returns
The regulated value.
#### Example
```
var regulate = require('json-regulator');

var promotions = ['production', 'prod'];
var eliminations = ['development', 'dev'];
var values = {
	src: 'src',
	dest: 'dist',
	options: {
		debug: false,
		override: false,
		development: {
			sourcemap: 'internal'
		},
		dev: {
			override: true
		},
		production: {
			sourcemap: 'external'
		},
		prod: {
			override: false
		}
	},
	development: {
		src: 'app',
		options: {
			debug: true
		}
	},
	dev: {
		dest: 'build',
		options: {
			override: 'auto'
		},
		settings: {
			expose: 'regulator'
		}
	},
	production: {
		src: 'src',
		options: {
			debug: false
		}
	},
	prod: {
		dest: 'dist',
		options: {
			override: 'smart'
		},
		settings: {
			expose: 'regulator-release'
		}
	}
};

values = regulate(values, promotions, eliminations);
```
Outout:
```
{
	src: 'src',
	dest: 'dist',
	options: {
		debug: false,
		override: 'smart',
		sourcemap: 'external'
	},
	settings: {
		expose: 'regulator-release'
	}
}
```

## Related

 * [json-normalizer](https://www.npmjs.com/package/json-normalizer)

## License
MIT

## Author
[Amobiz](https://github.com/amobiz)