# json-regulator
Manages conditional configurations by promoting and/or eliminating specific keys of a JSON value object.

## Install
``` bash
npm install json-regulator
```

## API

### `regulate(values, promotions, eliminations)`
For given JSON value object `values`, returns a new JSON value object, that promotes keys in `promotions` array one level up, and eliminats keys in both `promotions` and `eliminations` arrays.
#### Context
Don't care.
#### Parameters
##### `values`
The JSON value object needs to regulate.
##### `promotions`
Key or array of keys to promote.
##### `eliminations`
Key or array of keys to eliminate.
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
If you are using gulp, you can enable conditional build with conditional configurations.
``` javascript
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    doif = require('gulp-if'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util');

var production = ['production', 'prod'];
var development = ['development', 'dev'];
var config = {
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

## Change Log

* 2015/12/18 - 0.1.9

    * Feature: also process objects inside array values recursively.
    * Feature: allow type of `promotions` and `eliminations` argument to be `string`, instead of array of strings.
    * Enhance: returns a new JSON value object, rather then modifying it directly.

* 2015/12/15 - 0.1.0

    * First release.

## Related
 * [json-normalizer](https://www.npmjs.com/package/json-normalizer)

## License
MIT

## Author
[Amobiz](https://github.com/amobiz)