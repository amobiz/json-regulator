/* eslint no-undefined: 0 */
'use strict';

var test = require('mocha-cases');

var regulate = require('../');

function Ctor() {}

var cases = {
	robustness: [{
		name: 'should accept empty value and return as is: {value.values}, promotions: {value.promotions} and eliminations: {value.eliminations}',
		values: [{
			values: {},
			promotions: [],
			eliminations: [],
			immutables: []
		}, {
			values: [],
			promotions: [],
			eliminations: [],
			immutables: []
		}, {
			values: undefined,
			promotions: [],
			eliminations: [],
			immutables: []
		}, {
			values: null,
			promotions: [],
			eliminations: [],
			immutables: []
		}, {
			values: {},
			promotions: ['development', 'dev'],
			eliminations: [],
			immutables: []
		}, {
			values: {},
			promotions: 'development',
			eliminations: [],
			immutables: []
		}, {
			values: {},
			promotions: [],
			eliminations: ['development', 'dev'],
			immutables: []
		}, {
			values: {},
			promotions: [],
			eliminations: 'development',
			immutables: []
		}],
		expected: [
			{}, [], undefined, null, {}, {}, {}, {}
		]
	}],
	'plain-object-only': [{
		name: 'should only process plain object: {value.values}',
		values: [{
			values: Ctor,
			promotions: 'dev'
		}, {
			values: [],
			promotions: 'dev'
		}, {
			values: true,
			promotions: 'dev'
		}, {
			values: 'abcde',
			promotions: 'dev'
		}, {
			values: 12345,
			promotions: 'dev'
		}, {
			values: new RegExp(),
			promotions: 'dev'
		}, {
			values: { test: /\.css$/, loader: 'style' },
			promotions: 'dev'
		}, {
			values: Object.create({}),
			promotions: 'dev'
		}, {
			values: new Ctor(),
			promotions: 'dev'
		}],
		expected: [
			Ctor,
			[],
			true,
			'abcde',
			12345,
			new RegExp(),
			{ test: /\.css$/, loader: 'style' },
			Object.create({}),
			new Ctor()
		]
	}],
	promotions: [{
		name: "should promote and merge promotion values to it's parent",
		value: {
			values: {
				development: {
					src: 'src',
					options: {
						sourcemap: false
					}
				},
				dev: {
					dest: 'dist',
					settings: {
						expose: 'regulator'
					}
				},
				options: {
					silent: true
				}
			},
			promotions: ['development', 'dev'],
			eliminations: []
		},
		expected: {
			src: 'src',
			dest: 'dist',
			options: {
				silent: true,
				sourcemap: false
			},
			settings: {
				expose: 'regulator'
			}
		}
	}, {
		name: "should overwrite parent's values with default options",
		value: {
			values: {
				src: 'src',
				dest: 'dist',
				options: {
					debug: false
				},
				development: {
					src: 'app',
					options: {
						debug: true,
						sourcemap: true
					}
				},
				dev: {
					dest: 'build',
					settings: {
						expose: 'regulator'
					}
				}
			},
			promotions: ['development', 'dev'],
			eliminations: []
		},
		expected: {
			src: 'app',
			dest: 'build',
			options: {
				debug: true,
				sourcemap: true
			},
			settings: {
				expose: 'regulator'
			}
		}
	}, {
		name: "should not overwrite parent's values with options.overwrite set to false",
		value: {
			values: {
				src: 'src',
				dest: 'dist',
				options: {
					debug: false
				},
				development: {
					src: 'app',
					options: {
						debug: true,
						sourcemap: true
					}
				},
				dev: {
					dest: 'build',
					settings: {
						expose: 'regulator'
					}
				}
			},
			promotions: ['development', 'dev'],
			eliminations: [],
			options: {
				overwrite: false
			}
		},
		expected: {
			src: 'src',
			dest: 'dist',
			options: {
				debug: false,
				sourcemap: true
			},
			settings: {
				expose: 'regulator'
			}
		}
	}, {
		name: 'should later promotion values overwrite previous one with default options',
		value: {
			values: {
				development: {
					src: 'src',
					options: {
						override: false
					}
				},
				dev: {
					src: 'app',
					dest: 'dist',
					options: {
						override: true
					},
					settings: {
						expose: 'regulator'
					}
				}
			},
			promotions: ['development', 'dev'],
			eliminations: []
		},
		expected: {
			src: 'app',
			dest: 'dist',
			options: {
				override: true
			},
			settings: {
				expose: 'regulator'
			}
		}
	}, {
		name: 'should later promotion values not overwrite previous one with options.overwrite set to false',
		value: {
			values: {
				development: {
					src: 'src',
					options: {
						override: false
					}
				},
				dev: {
					src: 'app',
					dest: 'dist',
					options: {
						override: true
					},
					settings: {
						expose: 'regulator'
					}
				}
			},
			promotions: ['development', 'dev'],
			eliminations: [],
			options: { overwrite: false }
		},
		expected: {
			src: 'src',
			dest: 'dist',
			options: {
				override: false
			},
			settings: {
				expose: 'regulator'
			}
		}
	}],
	nesting: [{
		name: 'should handle nested values',
		value: {
			values: {
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
				}
			},
			promotions: ['development', 'dev'],
			eliminations: []
		},
		expected: {
			src: 'app',
			dest: 'build',
			options: {
				debug: true,
				override: 'auto',
				sourcemap: 'internal'
			},
			settings: {
				expose: 'regulator'
			}
		}

	}, {
		name: 'should accept array values and process recursively into its object items',
		values: [{
			values: [],
			promotions: ['development', 'dev'],
			eliminations: []
		}, {
			values: [1, '2'],
			promotions: ['development', 'dev'],
			eliminations: []
		}, {
			values: [[], [1], [1, '2']],
			promotions: ['development', 'dev'],
			eliminations: []
		}, {
			values: [{
				dev: {
					debug: true
				},
				development: [{
					debug: false
				}]
			}, [
				'dev', 'development'
			]],
			promotions: ['development', 'dev'],
			eliminations: []
		}],
		expected: [
			[],
			[1, '2'],
			[[], [1], [1, '2']],
			[{
				debug: true,
				development: [{
					debug: false
				}]
			}, [
				'dev', 'development'
			]]
		]
	}, {
		name: 'should never touch non-object values',
		values: [{
			values: [1, '2', true, null],
			promotions: ['development', 'dev'],
			eliminations: []
		}, {
			values: [{
				dev: 1
			}, {
				dev: '2'
			}, {
				dev: true
			}, {
				dev: null
			}, {
				dev: undefined
			}, {
				dev: [1, '2', true, null]
			}, {
				dev: {
					object: true
				}
			}],
			promotions: ['development', 'dev'],
			eliminations: []
		}],
		expected: [
			[1, '2', true, null],
			[{
				dev: 1
			}, {
				dev: '2'
			}, {
				dev: true
			}, {
				dev: null
			}, {
				dev: undefined
			}, {
				dev: [1, '2', true, null]
			}, {
				object: true
			}]
		]
	}],
	eliminations: [{
		name: 'should remove elimination values',
		value: {
			values: {
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
			},
			promotions: ['production', 'prod'],
			eliminations: ['development', 'dev']
		},
		expected: {
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
	}],
	immutables: [{
		name: 'should not mutate immutable values',
		value: {
			values: {
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
			},
			promotions: ['production', 'prod'],
			eliminations: ['development', 'dev'],
			immutables: ['options']
		},
		expected: {
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
			settings: {
				expose: 'regulator-release'
			}
		}
	}],
	flexible: [{
		name: 'should accept promotions, eliminations and immutables arguments as string',
		value: {
			values: {
				src: 'src',
				dest: 'dist',
				options: {
					debug: false,
					override: false,
					dev: {
						sourcemap: 'internal',
						override: true
					},
					prod: {
						sourcemap: 'external',
						override: false
					}
				},
				dev: {
					src: 'app',
					dest: 'build',
					options: {
						debug: true,
						override: 'auto'
					},
					settings: {
						expose: 'regulator'
					}
				},
				prod: {
					src: 'src',
					dest: 'dist',
					options: {
						debug: false,
						override: 'smart'
					},
					settings: {
						expose: 'regulator-release'
					}
				}
			},
			promotions: 'prod',
			eliminations: 'dev',
			immputables: 'no-touch'
		},
		expected: {
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
	}]
};

describe('regulate()', function () {
	Object.keys(cases).forEach(function (category) {
		describe(category, function () {
			test(cases[category], function (value) {
				return regulate(value.values, value.promotions, value.eliminations, value.immutables, value.options);
			});
		});
	});

	describe('optional parameters', function () {
		var values = {
			name: 'root',
			overwrite: 'no',
			immutable: 'immutable',
			dev: {
				type: 'dev',
				overwrite: 'yes',
				immutable: 'dev'
			},
			prod: {
				type: 'prod',
				overwrite: 'auto',
				immutable: 'prod'
			}
		};
		var promotions = ['dev'];
		var eliminations = ['prod'];
		var immutables = ['immutable'];
		var options = { overwrite: false };

		var optionalCases = [{
			name: 'argument `options` should be optional',
			value: values,
			expected: {
				name: 'root',
				overwrite: 'yes',
				immutable: 'immutable',
				type: 'dev'
			},
			runner: function (value) {
				return regulate(value, promotions, eliminations, immutables);
			}
		}, {
			name: 'parameter `immutables` should be optional',
			value: values,
			expected: {
				name: 'root',
				overwrite: 'no',
				immutable: 'immutable',
				type: 'dev'
			},
			runner: function (value) {
				return regulate(value, promotions, eliminations, options);
			}
		}, {
			name: 'parameter `immutables` and `options` should be optional',
			value: values,
			expected: {
				name: 'root',
				overwrite: 'yes',
				immutable: 'dev',
				type: 'dev'
			},
			runner: function (value) {
				return regulate(value, promotions, eliminations);
			}
		}, {
			name: 'parameter `eliminations` and `immutables` should be optional',
			value: values,
			expected: {
				name: 'root',
				overwrite: 'no',
				immutable: 'immutable',
				type: 'dev',
				prod: {
					type: 'prod',
					overwrite: 'auto',
					immutable: 'prod'
				}
			},
			runner: function (value) {
				return regulate(value, promotions, options);
			}
		}, {
			name: 'parameter `eliminations` and `immutables` and `options` should be optional',
			value: values,
			expected: {
				name: 'root',
				overwrite: 'yes',
				immutable: 'dev',
				type: 'dev',
				prod: {
					type: 'prod',
					overwrite: 'auto',
					immutable: 'prod'
				}
			},
			runner: function (value) {
				return regulate(value, promotions);
			}
		}, {
			name: 'when parameter `promotions` is absent, will do nothing',
			value: values,
			expected: values,
			runner: function (value) {
				return regulate(value);
			}
		}, {
			name: 'wen parameter `values` is absent, will do nothing',
			value: undefined,
			expected: undefined,
			runner: function () {
				return regulate();
			}
		}];

		test(optionalCases);
	});
});
