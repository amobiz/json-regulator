# json-regulator
Manages conditional configurations by promoting and/or eliminating specific keys of a JSON value object.

[![MIT](http://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/amobiz/json-regulator/blob/master/LICENSE) [![npm version](https://badge.fury.io/js/json-regulator.svg)](http://badge.fury.io/js/json-regulator) [![David Dependency Badge](https://david-dm.org/amobiz/json-regulator.svg)](https://david-dm.org/amobiz/json-regulator)
[![Build Status](https://travis-ci.org/amobiz/json-regulator.svg?branch=master)](https://travis-ci.org/amobiz/json-regulator)

[![NPM](https://nodei.co/npm/json-regulator.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/json-regulator.png?downloads=true&downloadRank=true&stars=true) [![NPM](https://nodei.co/npm-dl/json-regulator.png?months=6&height=3)](https://nodei.co/npm/json-regulator/)


## Install
``` bash
npm install json-regulator
```

## API

### `regulate(values, promotions, eliminations, immutables, options)`
For given JSON value object `values`, returns a new JSON value object, that promotes keys in `promotions` array one level up, and eliminats keys in both `promotions` and `eliminations` arrays.
#### Context
Don't care.
#### Parameters
##### `values`
The JSON value object needs to regulate.
##### `promotions`
Key or array of keys to promote.
##### `eliminations`
Optional. Key or array of keys to eliminate.
##### `immutables`
Optional. Key or array of keys that should never mutate.
##### `options`
###### `options.overwrite`
Optional. Overwrite existing values or not. Default is true.
#### Returns
A new regulated JSON value object.
#### Example
``` javascript
var regulate = require('json-regulator');

var production = ['production', 'prod'];
var development = ['development', 'dev'];
var config = {
    development: {
        description: 'development build',
        release: false,
        src: 'src/',
        dest: 'build/'
    },
    production: {
        description: 'production build',
        release: true,
        src: 'src/',
        dest: 'dist/',
        sourcemaps: {
            dest: 'maps/'
        }
    },
    scripts: {
        src: '**/*.js',
        prod: {
            bundle: 'bundle.js'
        },
        options: {
            debug: false,
            dev: {
                debug: true
            }
        }
    },
    deploy: {
        development: {
            settings: {
                'log-level': 'info'
            }
        },
        dev: {
            settings: {
                overwrite: 'force'
            }
        },
        production: {
            settings: {
                'log-level': 'warning'
            }
        },
        prod: {
            settings: {
                overwrite: 'auto'
            }
        }
    }
};
```

With the call:
``` javascript
config = regulate(config, production, development);
```

Generates:
``` javascript
{
    description: 'production build',
    release: true,
    src: 'src/',
    dest: 'dist/',
    sourcemaps: {
        dest: 'maps/'
    },
    scripts: {
        src: '**/*.js',
        bundle: 'bundle.js',
        options: {
            debug: false
        }
    },
    deploy: {
        settings: {
            'log-level': 'warning',
            overwrite: 'auto'
        }
    }
}
```

And with the call:
``` javascript
config = regulate(config, development, production);
```

Generates:
``` javascript
{
    description: 'development build',
    release: false
    src: 'src/',
    dest: 'build/',
    scripts: {
        src: '**/*.js',
        options: {
            debug: true
        }
    },
    deploy: {
        settings: {
            'log-level': 'info',
            overwrite: 'force'
        }
    }}
```

## Sample Usage

### Webpack

If you are using webpack, you can enable conditional build with conditional configurations.
``` javascript

```

### Gulp

If you are using gulp, you can enable conditional build with conditional configurations.
``` javascript
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    doif = require('gulp-if'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util');

var production = ['production', 'prod'],
    development = ['development', 'dev'],
    config = {
        // ...
    };

if (util.env.dev) {
    config = regulate(config, development, production);
} else {
    config = regulate(config, production, development);
}

gulp.task('scripts', function () {
    return gulp.src(config.src + config.scripts.src)
        .pipe(doif(config.sourcemaps, sourcemaps.init()))
        .pipe(doif(config.release, uglify()))
        .pipe(doif(config.release, concat(config.scripts.bundle)))
        .pipe(doif(config.sourcemaps, sourcemaps.write(config.dest + config.sourcemaps.dest)))
        .pipe(gulp.dest(config.dest));
});
```

Run gulp:
``` javascript
$ gulp --dev scripts
```

## Test
``` bash
$ npm test
```

## Related
* [json-normalizer](https://github.com/amobiz/json-normalizer)

## License
[MIT](https://opensource.org/licenses/MIT)

## Author
[Amobiz](https://github.com/amobiz)
