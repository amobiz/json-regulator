/* eslint no-undefined: 0 */
'use strict';

var test = require('mocha-cases');

var regulate = require('../');

var cases = [{
	name: 'should accept empty value and return as is: {value.values}, promotions: {value.promotions} and eliminations: {value.eliminations}',
	values: [{
		values: {},
		promotions: [],
		eliminations: []
	}, {
		values: [],
		promotions: [],
		eliminations: []
	}, {
		values: undefined,
		promotions: [],
		eliminations: []
	}, {
		values: null,
		promotions: [],
		eliminations: []
	}, {
		values: {},
		promotions: ['development', 'dev'],
		eliminations: []
	}, {
		values: {},
		promotions: 'development',
		eliminations: []
	}, {
		values: {},
		promotions: [],
		eliminations: ['development', 'dev']
	}, {
		values: {},
		promotions: [],
		eliminations: 'development'
	}],
	expected: [
		{}, [], undefined, null, {}, {}, {}, {}
	]
}, {
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
}, {
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
}, {
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
}, {
	name: 'should accept promotions and eliminations argument as string',
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
		eliminations: 'dev'
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
}];

describe('regulate()', function () {
	test(cases, function (value) {
		return regulate(value.values, value.promotions, value.eliminations, value.options);
	});
});
