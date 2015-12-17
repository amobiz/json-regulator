# json-regulator
Manage conditional configurations by promoting and/or eliminating specific keys of a JSON value object.

## Install
``` bash
npm install json-regulator
```

## API

### `regulate(values, promotions, eliminations)`
For given JSON value object `values`, promote keys in `promotions` array up one level and then eliminate keys in both `promotions` and `eliminations` arrays.
#### Context
Don't care.
#### Parameters
##### `values`
The JSON value object needs to regulate.
##### `promotions`
An array of keys to promote.
##### `eliminations`
An array of keys to eliminate.
#### Returns
The regulated value.
#### Example
``` javascript
var regulate = require('json-regulator');

var production = ['production', 'prod'];
var development = ['development', 'dev'];
var config = {
    src: 'src/',
    dev: {
        description: 'development build',
        dest: 'build/',
        release: false
    },
    prod: {
        description: 'production build',
        dest: 'dist/',
        release: true,
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
    src: 'src/',
    description: 'production build',
    dest: 'dist/',
    release: true,
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
    src: 'src/',
    description: 'development build',
    dest: 'build/',
    release: false
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

For sample usage, if you are using gulp, you can do this:
``` javascript
var gulp = require('gulp'),
    util = require('gulp-util'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    doif = require('gulp-if'),
    uglify = require('uglify');

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

Run in cli:
``` javascript
$ gulp --dev scripts
```

## Test
``` bash
$ npm test
```

## Related
 * [json-normalizer](https://www.npmjs.com/package/json-normalizer)

## License
MIT

## Author
[Amobiz](https://github.com/amobiz)