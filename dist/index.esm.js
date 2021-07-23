var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var convert_1 = convert$4;

function convert$4(test) {
  if (typeof test === 'string') {
    return typeFactory$3(test)
  }

  if (test === null || test === undefined) {
    return ok$3
  }

  if (typeof test === 'object') {
    return ('length' in test ? anyFactory$4 : matchesFactory)(test)
  }

  if (typeof test === 'function') {
    return test
  }

  throw new Error('Expected function, string, or object as test')
}

function convertAll(tests) {
  var results = [];
  var length = tests.length;
  var index = -1;

  while (++index < length) {
    results[index] = convert$4(tests[index]);
  }

  return results
}

// Utility assert each property in `test` is represented in `node`, and each
// values are strictly equal.
function matchesFactory(test) {
  return matches

  function matches(node) {
    var key;

    for (key in test) {
      if (node[key] !== test[key]) {
        return false
      }
    }

    return true
  }
}

function anyFactory$4(tests) {
  var checks = convertAll(tests);
  var length = checks.length;

  return matches

  function matches() {
    var index = -1;

    while (++index < length) {
      if (checks[index].apply(this, arguments)) {
        return true
      }
    }

    return false
  }
}

// Utility to convert a string into a function which checks a given node’s type
// for said string.
function typeFactory$3(test) {
  return type

  function type(node) {
    return Boolean(node && node.type === test)
  }
}

// Utility to return true.
function ok$3() {
  return true
}

var unistUtilVisitParents = visitParents$2;

var convert$3 = convert_1;

var CONTINUE$2 = true;
var SKIP$2 = 'skip';
var EXIT$2 = false;

visitParents$2.CONTINUE = CONTINUE$2;
visitParents$2.SKIP = SKIP$2;
visitParents$2.EXIT = EXIT$2;

function visitParents$2(tree, test, visitor, reverse) {
  var is;

  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor;
    visitor = test;
    test = null;
  }

  is = convert$3(test);

  one(tree, null, []);

  // Visit a single node.
  function one(node, index, parents) {
    var result = [];
    var subresult;

    if (!test || is(node, index, parents[parents.length - 1] || null)) {
      result = toResult$1(visitor(node, parents));

      if (result[0] === EXIT$2) {
        return result
      }
    }

    if (node.children && result[0] !== SKIP$2) {
      subresult = toResult$1(all(node.children, parents.concat(node)));
      return subresult[0] === EXIT$2 ? subresult : result
    }

    return result
  }

  // Visit children in `parent`.
  function all(children, parents) {
    var min = -1;
    var step = reverse ? -1 : 1;
    var index = (reverse ? children.length : min) + step;
    var result;

    while (index > min && index < children.length) {
      result = one(children[index], index, parents);

      if (result[0] === EXIT$2) {
        return result
      }

      index = typeof result[1] === 'number' ? result[1] : index + step;
    }
  }
}

function toResult$1(value) {
  if (value !== null && typeof value === 'object' && 'length' in value) {
    return value
  }

  if (typeof value === 'number') {
    return [CONTINUE$2, value]
  }

  return [value]
}

var unistUtilVisit = visit$2;

var visitParents$1 = unistUtilVisitParents;

var CONTINUE$1 = visitParents$1.CONTINUE;
var SKIP$1 = visitParents$1.SKIP;
var EXIT$1 = visitParents$1.EXIT;

visit$2.CONTINUE = CONTINUE$1;
visit$2.SKIP = SKIP$1;
visit$2.EXIT = EXIT$1;

function visit$2(tree, test, visitor, reverse) {
  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor;
    visitor = test;
    test = null;
  }

  visitParents$1(tree, test, overload, reverse);

  function overload(node, parents) {
    var parent = parents[parents.length - 1];
    var index = parent ? parent.children.indexOf(node) : null;
    return visitor(node, index, parent)
  }
}

var lodash_iteratee = {exports: {}};

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

(function (module, exports) {
/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {boolean} [bitmask] The bitmask of comparison flags.
 *  The bitmask may be composed of the following flags:
 *     1 - Unordered comparison
 *     2 - Partial comparison
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, bitmask, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  var objIsObj = objTag == objectTag && !isHostObject(object),
      othIsObj = othTag == objectTag && !isHostObject(other),
      isSameTag = objTag == othTag;

  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
  }
  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
}

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
  };
}

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!seen.has(othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
              return seen.add(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, customizer, bitmask, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= UNORDERED_COMPARE_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = isKey(path, object) ? [path] : castPath(path);

  var result,
      index = -1,
      length = path.length;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * Creates a function that invokes `func` with the arguments of the created
 * function. If `func` is a property name, the created function returns the
 * property value for a given element. If `func` is an array or object, the
 * created function returns `true` for elements that contain the equivalent
 * source properties, otherwise it returns `false`.
 *
 * @static
 * @since 4.0.0
 * @memberOf _
 * @category Util
 * @param {*} [func=_.identity] The value to convert to a callback.
 * @returns {Function} Returns the callback.
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
 * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, _.iteratee(['user', 'fred']));
 * // => [{ 'user': 'fred', 'age': 40 }]
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, _.iteratee('user'));
 * // => ['barney', 'fred']
 *
 * // Create custom iteratee shorthands.
 * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
 *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
 *     return func.test(string);
 *   };
 * });
 *
 * _.filter(['abc', 'def'], /ef/);
 * // => ['def']
 */
function iteratee(func) {
  return baseIteratee(typeof func == 'function' ? func : baseClone(func, true));
}

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = iteratee;
}(lodash_iteratee, lodash_iteratee.exports));

/**
 * @author Richard Smith-Unna
 * @copyright 2016 Richard Smith-Unnar
 * @license MIT
 * @module unist:find
 * @fileoverview Unist node finder
 */

var visit$1 = unistUtilVisit;
var iteratee = lodash_iteratee.exports;

/**
 * Find
 *
 * @param {Node} tree - Root node
 * @param {string|object|function} [condition] - Condition to match node.
 */
function find$1 (tree, condition) {
  if (!tree) throw new Error('unist-find requires a tree to search')
  if (!condition) throw new Error('unist-find requires a condition')

  var predicate = iteratee(condition);
  var result;

  visit$1(tree, function (node) {
    if (predicate(node)) {
      result = node;
      return false
    }
  });

  return result
}

/*
 * Expose.
 */
var unistUtilFind = find$1;

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 *
 * @typedef {string} Type
 * @typedef {Object<string, unknown>} Props
 *
 * @typedef {null|undefined|Type|Props|TestFunctionAnything|Array.<Type|Props|TestFunctionAnything>} Test
 */

var convert$2 =
  /**
   * @type {(
   *   (<T extends Node>(test: T['type']|Partial<T>|TestFunctionPredicate<T>) => AssertPredicate<T>) &
   *   ((test?: Test) => AssertAnything)
   * )}
   */
  (
    /**
     * Generate an assertion from a check.
     * @param {Test} [test]
     * When nullish, checks if `node` is a `Node`.
     * When `string`, works like passing `function (node) {return node.type === test}`.
     * When `function` checks if function passed the node is true.
     * When `object`, checks that all keys in test are in node, and that they have (strictly) equal values.
     * When `array`, checks any one of the subtests pass.
     * @returns {AssertAnything}
     */
    function (test) {
      if (test === undefined || test === null) {
        return ok$2
      }

      if (typeof test === 'string') {
        return typeFactory$2(test)
      }

      if (typeof test === 'object') {
        // @ts-ignore looks like a list of tests / partial test object.
        return 'length' in test ? anyFactory$3(test) : propsFactory$2(test)
      }

      if (typeof test === 'function') {
        return castFactory$3(test)
      }

      throw new Error('Expected function, string, or object as test')
    }
  );
/**
 * @param {Array.<Type|Props|TestFunctionAnything>} tests
 * @returns {AssertAnything}
 */
function anyFactory$3(tests) {
  /** @type {Array.<AssertAnything>} */
  var checks = [];
  var index = -1;

  while (++index < tests.length) {
    checks[index] = convert$2(tests[index]);
  }

  return castFactory$3(any)

  /**
   * @this {unknown}
   * @param {unknown[]} parameters
   * @returns {boolean}
   */
  function any(...parameters) {
    var index = -1;

    while (++index < checks.length) {
      if (checks[index].call(this, ...parameters)) return true
    }
  }
}

/**
 * Utility to assert each property in `test` is represented in `node`, and each
 * values are strictly equal.
 *
 * @param {Props} check
 * @returns {AssertAnything}
 */
function propsFactory$2(check) {
  return castFactory$3(all)

  /**
   * @param {Node} node
   * @returns {boolean}
   */
  function all(node) {
    /** @type {string} */
    var key;

    for (key in check) {
      if (node[key] !== check[key]) return
    }

    return true
  }
}

/**
 * Utility to convert a string into a function which checks a given node’s type
 * for said string.
 *
 * @param {Type} check
 * @returns {AssertAnything}
 */
function typeFactory$2(check) {
  return castFactory$3(type)

  /**
   * @param {Node} node
   */
  function type(node) {
    return node && node.type === check
  }
}

/**
 * Utility to convert a string into a function which checks a given node’s type
 * for said string.
 * @param {TestFunctionAnything} check
 * @returns {AssertAnything}
 */
function castFactory$3(check) {
  return assertion

  /**
   * @this {unknown}
   * @param {Array.<unknown>} parameters
   * @returns {boolean}
   */
  function assertion(...parameters) {
    return Boolean(check.call(this, ...parameters))
  }
}

// Utility to return true.
function ok$2() {
  return true
}

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 *
 * @typedef {import('unist-util-is').Type} Type
 * @typedef {import('unist-util-is').Props} Props
 * @typedef {import('unist-util-is').TestFunctionAnything} TestFunctionAnything
 */

const findAllAfter =
  /**
   * @type {(
   *  (<T extends Node>(node: Parent, index: Node|number, test: T['type']|Partial<T>|import('unist-util-is').TestFunctionPredicate<T>|Array.<T['type']|Partial<T>|import('unist-util-is').TestFunctionPredicate<T>>) => Array.<T>) &
   *  ((node: Parent, index: Node|number, test?: null|undefined|Type|Props|TestFunctionAnything|Array<Type|Props|TestFunctionAnything>) => Array.<Node>)
   * )}
   */
  (
    /**
     * Utility to get all children of a parent after a node or index
     *
     * @param {Parent} parent Parent node
     * @param {Node|number} index Child of `parent`, or it’s index
     * @param {null|undefined|Type|Props|TestFunctionAnything|Array<Type|Props|TestFunctionAnything>} [test] is-compatible test (such as a type)
     * @returns {Array.<Node>}
     */
    function (parent, index, test) {
      var is = convert$2(test);
      /** @type {Array.<Node>} */
      var results = [];

      if (!parent || !parent.type || !parent.children) {
        throw new Error('Expected parent node')
      }

      if (typeof index === 'number') {
        if (index < 0 || index === Number.POSITIVE_INFINITY) {
          throw new Error('Expected positive finite number as index')
        }
      } else {
        index = parent.children.indexOf(index);

        if (index < 0) {
          throw new Error('Expected child node or index')
        }
      }

      while (++index < parent.children.length) {
        if (is(parent.children[index], index, parent)) {
          results.push(parent.children[index]);
        }
      }

      return results
    }
  );

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 *
 * @typedef {string} Type
 * @typedef {Object<string, unknown>} Props
 *
 * @typedef {null|undefined|Type|Props|TestFunctionAnything|Array.<Type|Props|TestFunctionAnything>} Test
 */

var convert$1 =
  /**
   * @type {(
   *   (<T extends Node>(test: T['type']|Partial<T>|TestFunctionPredicate<T>) => AssertPredicate<T>) &
   *   ((test?: Test) => AssertAnything)
   * )}
   */
  (
    /**
     * Generate an assertion from a check.
     * @param {Test} [test]
     * When nullish, checks if `node` is a `Node`.
     * When `string`, works like passing `function (node) {return node.type === test}`.
     * When `function` checks if function passed the node is true.
     * When `object`, checks that all keys in test are in node, and that they have (strictly) equal values.
     * When `array`, checks any one of the subtests pass.
     * @returns {AssertAnything}
     */
    function (test) {
      if (test === undefined || test === null) {
        return ok$1
      }

      if (typeof test === 'string') {
        return typeFactory$1(test)
      }

      if (typeof test === 'object') {
        // @ts-ignore looks like a list of tests / partial test object.
        return 'length' in test ? anyFactory$2(test) : propsFactory$1(test)
      }

      if (typeof test === 'function') {
        return castFactory$2(test)
      }

      throw new Error('Expected function, string, or object as test')
    }
  );
/**
 * @param {Array.<Type|Props|TestFunctionAnything>} tests
 * @returns {AssertAnything}
 */
function anyFactory$2(tests) {
  /** @type {Array.<AssertAnything>} */
  var checks = [];
  var index = -1;

  while (++index < tests.length) {
    checks[index] = convert$1(tests[index]);
  }

  return castFactory$2(any)

  /**
   * @this {unknown}
   * @param {unknown[]} parameters
   * @returns {boolean}
   */
  function any(...parameters) {
    var index = -1;

    while (++index < checks.length) {
      if (checks[index].call(this, ...parameters)) return true
    }
  }
}

/**
 * Utility to assert each property in `test` is represented in `node`, and each
 * values are strictly equal.
 *
 * @param {Props} check
 * @returns {AssertAnything}
 */
function propsFactory$1(check) {
  return castFactory$2(all)

  /**
   * @param {Node} node
   * @returns {boolean}
   */
  function all(node) {
    /** @type {string} */
    var key;

    for (key in check) {
      if (node[key] !== check[key]) return
    }

    return true
  }
}

/**
 * Utility to convert a string into a function which checks a given node’s type
 * for said string.
 *
 * @param {Type} check
 * @returns {AssertAnything}
 */
function typeFactory$1(check) {
  return castFactory$2(type)

  /**
   * @param {Node} node
   */
  function type(node) {
    return node && node.type === check
  }
}

/**
 * Utility to convert a string into a function which checks a given node’s type
 * for said string.
 * @param {TestFunctionAnything} check
 * @returns {AssertAnything}
 */
function castFactory$2(check) {
  return assertion

  /**
   * @this {unknown}
   * @param {Array.<unknown>} parameters
   * @returns {boolean}
   */
  function assertion(...parameters) {
    return Boolean(check.call(this, ...parameters))
  }
}

// Utility to return true.
function ok$1() {
  return true
}

/**
 * @param {string} d
 * @returns {string}
 */
function color(d) {
  return '\u001B[33m' + d + '\u001B[39m'
}

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('unist-util-is').Test} Test
 */

/**
 * Continue traversing as normal
 */
const CONTINUE = true;
/**
 * Do not traverse this node’s children
 */
const SKIP = 'skip';
/**
 * Stop traversing immediately
 */
const EXIT = false;

const visitParents =
  /**
   * @type {(
   *   (<T extends Node>(tree: Node, test: T['type']|Partial<T>|import('unist-util-is').TestFunctionPredicate<T>|Array.<T['type']|Partial<T>|import('unist-util-is').TestFunctionPredicate<T>>, visitor: Visitor<T>, reverse?: boolean) => void) &
   *   ((tree: Node, test: Test, visitor: Visitor<Node>, reverse?: boolean) => void) &
   *   ((tree: Node, visitor: Visitor<Node>, reverse?: boolean) => void)
   * )}
   */
  (
    /**
     * Visit children of tree which pass a test
     *
     * @param {Node} tree Abstract syntax tree to walk
     * @param {Test} test test Test node
     * @param {Visitor<Node>} visitor Function to run for each node
     * @param {boolean} [reverse] Fisit the tree in reverse, defaults to false
     */
    function (tree, test, visitor, reverse) {
      if (typeof test === 'function' && typeof visitor !== 'function') {
        reverse = visitor;
        // @ts-ignore no visitor given, so `visitor` is test.
        visitor = test;
        test = null;
      }

      var is = convert$1(test);
      var step = reverse ? -1 : 1;

      factory(tree, null, [])();

      /**
       * @param {Node} node
       * @param {number?} index
       * @param {Array.<Parent>} parents
       */
      function factory(node, index, parents) {
        /** @type {Object.<string, unknown>} */
        var value = typeof node === 'object' && node !== null ? node : {};
        /** @type {string} */
        var name;

        if (typeof value.type === 'string') {
          name =
            typeof value.tagName === 'string'
              ? value.tagName
              : typeof value.name === 'string'
              ? value.name
              : undefined;

          Object.defineProperty(visit, 'name', {
            value:
              'node (' +
              color(value.type + (name ? '<' + name + '>' : '')) +
              ')'
          });
        }

        return visit

        function visit() {
          /** @type {ActionTuple} */
          var result = [];
          /** @type {ActionTuple} */
          var subresult;
          /** @type {number} */
          var offset;
          /** @type {Array.<Parent>} */
          var grandparents;

          if (!test || is(node, index, parents[parents.length - 1] || null)) {
            result = toResult(visitor(node, parents));

            if (result[0] === EXIT) {
              return result
            }
          }

          if (node.children && result[0] !== SKIP) {
            // @ts-ignore looks like a parent.
            offset = (reverse ? node.children.length : -1) + step;
            // @ts-ignore looks like a parent.
            grandparents = parents.concat(node);

            // @ts-ignore looks like a parent.
            while (offset > -1 && offset < node.children.length) {
              subresult = factory(node.children[offset], offset, grandparents)();

              if (subresult[0] === EXIT) {
                return subresult
              }

              offset =
                typeof subresult[1] === 'number' ? subresult[1] : offset + step;
            }
          }

          return result
        }
      }
    }
  );

/**
 * @param {VisitorResult} value
 * @returns {ActionTuple}
 */
function toResult(value) {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'number') {
    return [CONTINUE, value]
  }

  return [value]
}

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('unist-util-is').Test} Test
 * @typedef {import('unist-util-visit-parents').VisitorResult} VisitorResult
 */

const visit =
  /**
   * @type {(
   *   (<T extends Node>(tree: Node, test: T['type']|Partial<T>|import('unist-util-is').TestFunctionPredicate<T>|Array.<T['type']|Partial<T>|import('unist-util-is').TestFunctionPredicate<T>>, visitor: Visitor<T>, reverse?: boolean) => void) &
   *   ((tree: Node, test: Test, visitor: Visitor<Node>, reverse?: boolean) => void) &
   *   ((tree: Node, visitor: Visitor<Node>, reverse?: boolean) => void)
   * )}
   */
  (
    /**
     * Visit children of tree which pass a test
     *
     * @param {Node} tree Abstract syntax tree to walk
     * @param {Test} test test Test node
     * @param {Visitor<Node>} visitor Function to run for each node
     * @param {boolean} [reverse] Fisit the tree in reverse, defaults to false
     */
    function (tree, test, visitor, reverse) {
      if (typeof test === 'function' && typeof visitor !== 'function') {
        reverse = visitor;
        visitor = test;
        test = null;
      }

      visitParents(tree, test, overload, reverse);

      /**
       * @param {Node} node
       * @param {Array.<Parent>} parents
       */
      function overload(node, parents) {
        var parent = parents[parents.length - 1];
        return visitor(
          node,
          parent ? parent.children.indexOf(node) : null,
          parent
        )
      }
    }
  );

/**
 * @typedef {import('unist').Node} Node
 * @typedef {Node & {position: undefined}} NodeWithUndefinedPosition
 * @typedef {Omit<Node, 'position'>} NodeWithoutPosition
 */

const removePosition =
  /**
   * @type {(
   *   ((tree: Node, force?: false) => NodeWithUndefinedPosition) &
   *   ((tree: Node, force: true) => NodeWithoutPosition)
   * )}
   */
  (
    /**
     * Utility to remove positions from a tree
     *
     * @param {Node} node the unist tree
     * @param {boolean} [force=false] if `force` is given, uses `delete`, otherwise, sets positions to `undefined`.
     * @returns {NodeWithUndefinedPosition}
     */
    function (node, force) {
      visit(node, remove);

      // @ts-ignore hush TS, we know what we’re doing.
      return node

      /**
       * @param {Node} node the unist tree
       */
      function remove(node) {
        if (force) {
          delete node.position;
        } else {
          node.position = undefined;
        }
      }
    }
  );

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('unist').Literal} Literal
 * @typedef {Object.<string, unknown>} Props
 * @typedef {Array.<Node>|string} ChildrenOrValue
 *
 * @typedef {(<T extends string, P extends Record<string, unknown>, C extends Node[]>(type: T, props: P, children: C) => {type: T, children: C} & P)} BuildParentWithProps
 * @typedef {(<T extends string, P extends Record<string, unknown>>(type: T, props: P, value: string) => {type: T, value: string} & P)} BuildLiteralWithProps
 * @typedef {(<T extends string, P extends Record<string, unknown>>(type: T, props: P) => {type: T} & P)} BuildVoidWithProps
 * @typedef {(<T extends string, C extends Node[]>(type: T, children: C) => {type: T, children: C})} BuildParent
 * @typedef {(<T extends string>(type: T, value: string) => {type: T, value: string})} BuildLiteral
 * @typedef {(<T extends string>(type: T) => {type: T})} BuildVoid
 */

var u = /**
 * @type {BuildVoid & BuildVoidWithProps & BuildLiteral & BuildLiteralWithProps & BuildParent & BuildParentWithProps}
 */ (
  /**
   * @param {string} type Type of node
   * @param {Props|ChildrenOrValue} [props] Additional properties for node (or `children` or `value`)
   * @param {ChildrenOrValue} [value] `children` or `value` of node
   * @returns {Node}
   */
  function (type, props, value) {
    /** @type {Node} */
    var node = {type: String(type)};

    if (
      (value === undefined || value === null) &&
      (typeof props === 'string' || Array.isArray(props))
    ) {
      value = props;
    } else {
      Object.assign(node, props);
    }

    if (Array.isArray(value)) {
      node.children = value;
    } else if (value !== undefined && value !== null) {
      node.value = String(value);
    }

    return node
  }
);

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('mdast').Literal} Literal
 * @typedef {import('mdast').Text} Text
 * @typedef {import('./index.js').H} H
 * @typedef {import('./index.js').Handler} Handler
 * @typedef {import('./index.js').Content} Content
 */

var own$7 = {}.hasOwnProperty;

/**
 * Transform an unknown node.
 * @type {Handler}
 */
function unknown(h, node) {
  if (text$2(node)) {
    return h.augment(node, u('text', node.value))
  }

  return h(node, 'div', all$1(h, node))
}

/**
 * @type {Handler}
 */
function one$1(h, node, parent) {
  var type = node && node.type;
  /** @type {Handler} */
  var fn;

  // Fail on non-nodes.
  if (!type) {
    throw new Error('Expected node, got `' + node + '`')
  }

  if (own$7.call(h.handlers, type)) {
    fn = h.handlers[type];
  } else if (h.passThrough && h.passThrough.includes(type)) {
    fn = returnNode;
  } else {
    fn = h.unknownHandler;
  }

  return (typeof fn === 'function' ? fn : unknown)(h, node, parent)
}

/**
 * Check if the node should be renderered as a text node.
 * @param {Node} node
 * @returns {node is Literal}
 */
function text$2(node) {
  var data = node.data || {};

  if (
    own$7.call(data, 'hName') ||
    own$7.call(data, 'hProperties') ||
    own$7.call(data, 'hChildren')
  ) {
    return false
  }

  return 'value' in node
}

/**
 * @type {Handler}
 */
function returnNode(h, node) {
  // @ts-ignore pass through any unknown node.
  return node.children ? {...node, children: all$1(h, node)} : node
}

/**
 * @param {H} h
 * @param {Node} parent
 */
function all$1(h, parent) {
  /** @type {Array.<Node>} */
  // @ts-ignore looks like a parent.
  var nodes = parent.children || [];
  var index = -1;
  /** @type {Array.<Content>} */
  var values = [];
  /** @type {Content} */
  var result;
  /** @type {Content} */
  var head;

  while (++index < nodes.length) {
    // @ts-ignore looks like a parent.
    result = one$1(h, nodes[index], parent);

    if (result) {
      if (index && nodes[index - 1].type === 'break') {
        if (result.type === 'text') {
          result.value = result.value.replace(/^\s+/, '');
        }

        if (result.type === 'element') {
          head = result.children[0];

          if (head && head.type === 'text') {
            head.value = head.value.replace(/^\s+/, '');
          }
        }
      }

      values = values.concat(result);
    }
  }

  return values
}

/**
 * @typedef {import('unist').Position} Position
 * @typedef {import('unist').Point} Point
 *
 * @typedef {Partial<Point>} PointLike
 *
 * @typedef {Object} PositionLike
 * @property {PointLike} [start]
 * @property {PointLike} [end]
 *
 * @typedef {Object} NodeLike
 * @property {PositionLike} [position]
 */

var pointStart = point('start');
var pointEnd = point('end');

/**
 * Get the positional info of `node`.
 *
 * @param {'start'|'end'} type
 */
function point(type) {
  return point

  /**
   * Get the positional info of `node`.
   *
   * @param {NodeLike} [node]
   * @returns {Point}
   */
  function point(node) {
    /** @type {Point} */
    // @ts-ignore looks like a point
    var point = (node && node.position && node.position[type]) || {};

    return {
      line: point.line || null,
      column: point.column || null,
      offset: point.offset > -1 ? point.offset : null
    }
  }
}

/**
 * @typedef {Object} PointLike
 * @property {number} [line]
 * @property {number} [column]
 * @property {number} [offset]
 *
 * @typedef {Object} PositionLike
 * @property {PointLike} [start]
 * @property {PointLike} [end]
 *
 * @typedef {Object} NodeLike
 * @property {PositionLike} [position]
 */

/**
 * Check if `node` is *generated*.
 *
 * @param {NodeLike} [node]
 * @returns {boolean}
 */
function generated(node) {
  return (
    !node ||
    !node.position ||
    !node.position.start ||
    !node.position.start.line ||
    !node.position.start.column ||
    !node.position.end ||
    !node.position.end.line ||
    !node.position.end.column
  )
}

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('mdast').Definition} Definition
 * @typedef {import('unist-util-visit').Visitor<Definition>} DefinitionVisitor
 */

var own$6 = {}.hasOwnProperty;

/**
 *
 * @param {Node} node
 */
function definitions(node) {
  /** @type {Object.<string, Definition>} */
  var cache = Object.create(null);

  if (!node || !node.type) {
    throw new Error('mdast-util-definitions expected node')
  }

  visit(node, 'definition', ondefinition);

  return getDefinition

  /** @type {DefinitionVisitor} */
  function ondefinition(definition) {
    var id = clean(definition.identifier);
    if (id && !own$6.call(cache, id)) {
      cache[id] = definition;
    }
  }

  /**
   * Get a node from the bound definition-cache.
   *
   * @param {string} identifier
   * @returns {Definition|null}
   */
  function getDefinition(identifier) {
    var id = clean(identifier);
    return id && own$6.call(cache, id) ? cache[id] : null
  }
}

/**
 * @param {string} [value]
 * @returns {string}
 */
function clean(value) {
  return String(value || '').toUpperCase()
}

/**
 * @typedef {import('mdast').ThematicBreak} ThematicBreak
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {ThematicBreak} [node]
 */
function thematicBreak(h, node) {
  return h(node, 'hr')
}

/**
 * @typedef {import('./index.js').Content} Content
 */

/**
 * Wrap `nodes` with line feeds between each entry.
 * Optionally adds line feeds at the start and end.
 *
 * @param {Array.<Content>} nodes
 * @param {boolean} [loose=false]
 * @returns {Array.<Content>}
 */
function wrap(nodes, loose) {
  /** @type {Array.<Content>} */
  var result = [];
  var index = -1;

  if (loose) {
    result.push(u('text', '\n'));
  }

  while (++index < nodes.length) {
    if (index) result.push(u('text', '\n'));
    result.push(nodes[index]);
  }

  if (loose && nodes.length > 0) {
    result.push(u('text', '\n'));
  }

  return result
}

/**
 * @typedef {import('mdast').List} List
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {List} node
 */
function list(h, node) {
  /** @type {Properties} */
  var props = {};
  var name = node.ordered ? 'ol' : 'ul';
  var items = all$1(h, node);
  var index = -1;

  if (typeof node.start === 'number' && node.start !== 1) {
    props.start = node.start;
  }

  // Like GitHub, add a class for custom styling.
  while (++index < items.length) {
    if (
      items[index].type === 'element' &&
      items[index].tagName === 'li' &&
      // @ts-ignore looks like properties.
      items[index].properties.className &&
      // @ts-ignore looks like properties.
      items[index].properties.className.includes('task-list-item')
    ) {
      props.className = ['contains-task-list'];
      break
    }
  }

  return h(node, name, props, wrap(items, true))
}

/**
 * @typedef {import('mdast').BlockContent} BlockContent
 * @typedef {import('mdast').FootnoteDefinition} FootnoteDefinition
 * @typedef {import('mdast').Link} Link
 * @typedef {import('mdast').ListItem} ListItem
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('./index.js').H} H
 */

/**
 * @param {H} h
 */
function footer(h) {
  var footnoteById = h.footnoteById;
  var footnoteOrder = h.footnoteOrder;
  var index = -1;
  /** @type {Array.<ListItem>} */
  var listItems = [];
  /** @type {FootnoteDefinition} */
  var def;
  /** @type {Link} */
  var backReference;
  /** @type {Array.<BlockContent>} */
  var content;
  /** @type {string} */
  var marker;

  while (++index < footnoteOrder.length) {
    def = footnoteById[footnoteOrder[index].toUpperCase()];

    if (!def) {
      continue
    }

    marker = String(index + 1);

    content = [...def.children];
    backReference = {
      type: 'link',
      url: '#fnref' + marker,
      data: {hProperties: {className: ['footnote-back'], role: 'doc-backlink'}},
      children: [{type: 'text', value: '↩'}]
    };

    if (
      content[content.length - 1] &&
      content[content.length - 1].type === 'paragraph'
    ) {
      // @ts-ignore it’s a paragraph, TypeScript…
      content[content.length - 1].children.push(backReference);
    } else {
      // @ts-ignore Indeed, link directly added in block content.
      content.push(backReference);
    }

    listItems.push({
      type: 'listItem',
      data: {hProperties: {id: 'fn' + marker, role: 'doc-endnote'}},
      children: content,
      position: def.position
    });
  }

  if (listItems.length === 0) {
    return null
  }

  return h(
    null,
    'section',
    {className: ['footnotes'], role: 'doc-endnotes'},
    wrap(
      [].concat(
        thematicBreak(h),
        list(h, {type: 'list', ordered: true, children: listItems})
      ),
      true
    )
  )
}

/**
 * @typedef {import('mdast').Blockquote} Blockquote
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {Blockquote} node
 */
function blockquote(h, node) {
  return h(node, 'blockquote', wrap(all$1(h, node), true))
}

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('mdast').Break} Break
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {Break} node
 * @returns {Array.<Node>}
 */
function hardBreak(h, node) {
  return [h(node, 'br'), u('text', '\n')]
}

/**
 * @typedef {import('mdast').Code} Code
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {Code} node
 */
function code(h, node) {
  var value = node.value ? node.value + '\n' : '';
  // To do: next major, use `node.lang` w/o regex, the splitting’s been going
  // on for years in remark now.
  var lang = node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/);
  /** @type {Properties} */
  var props = {};
  /** @type {Element} */
  var code;

  if (lang) {
    props.className = ['language-' + lang];
  }

  code = h(node, 'code', props, [u('text', value)]);

  if (node.meta) {
    code.data = {meta: node.meta};
  }

  return h(node.position, 'pre', [code])
}

/**
 * @typedef {import('mdast').Delete} Delete
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {Delete} node
 */
function strikethrough(h, node) {
  return h(node, 'del', all$1(h, node))
}

/**
 * @typedef {import('mdast').Emphasis} Emphasis
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {Emphasis} node
 */
function emphasis(h, node) {
  return h(node, 'em', all$1(h, node))
}

/**
 * @typedef {import('mdast').FootnoteReference} FootnoteReference
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {FootnoteReference} node
 */
function footnoteReference(h, node) {
  var footnoteOrder = h.footnoteOrder;
  var identifier = String(node.identifier);
  var index = footnoteOrder.indexOf(identifier);
  var marker = String(index === -1 ? footnoteOrder.push(identifier) : index + 1);

  return h(
    node,
    'a',
    {
      href: '#fn' + marker,
      className: ['footnote-ref'],
      id: 'fnref' + marker,
      role: 'doc-noteref'
    },
    [h(node.position, 'sup', [u('text', marker)])]
  )
}

/**
 * @typedef {import('mdast').Footnote} Footnote
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {Footnote} node
 */
function footnote(h, node) {
  var footnoteById = h.footnoteById;
  var footnoteOrder = h.footnoteOrder;
  var no = 1;
  /** @type {string} */
  var identifier;

  while (no in footnoteById) no++;

  identifier = String(no);

  // No need to check if `identifier` exists in `footnoteOrder`, it’s guaranteed
  // to not exist because we just generated it.
  footnoteOrder.push(identifier);

  footnoteById[identifier] = {
    type: 'footnoteDefinition',
    identifier,
    children: [{type: 'paragraph', children: node.children}],
    position: node.position
  };

  return footnoteReference(h, {
    type: 'footnoteReference',
    identifier,
    position: node.position
  })
}

/**
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {Heading} node
 */
function heading(h, node) {
  return h(node, 'h' + node.depth, all$1(h, node))
}

/**
 * @typedef {import('mdast').HTML} HTML
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * Return either a `raw` node in dangerous mode, otherwise nothing.
 *
 * @type {Handler}
 * @param {HTML} node
 */
function html$4(h, node) {
  // @ts-ignore non-standard raw nodes.
  return h.dangerous ? h.augment(node, u('raw', node.value)) : null
}

var encodeCache = {};


// Create a lookup array where anything but characters in `chars` string
// and alphanumeric chars is percent-encoded.
//
function getEncodeCache(exclude) {
  var i, ch, cache = encodeCache[exclude];
  if (cache) { return cache; }

  cache = encodeCache[exclude] = [];

  for (i = 0; i < 128; i++) {
    ch = String.fromCharCode(i);

    if (/^[0-9a-z]$/i.test(ch)) {
      // always allow unencoded alphanumeric characters
      cache.push(ch);
    } else {
      cache.push('%' + ('0' + i.toString(16).toUpperCase()).slice(-2));
    }
  }

  for (i = 0; i < exclude.length; i++) {
    cache[exclude.charCodeAt(i)] = exclude[i];
  }

  return cache;
}


// Encode unsafe characters with percent-encoding, skipping already
// encoded sequences.
//
//  - string       - string to encode
//  - exclude      - list of characters to ignore (in addition to a-zA-Z0-9)
//  - keepEscaped  - don't encode '%' in a correct escape sequence (default: true)
//
function encode(string, exclude, keepEscaped) {
  var i, l, code, nextCode, cache,
      result = '';

  if (typeof exclude !== 'string') {
    // encode(string, keepEscaped)
    keepEscaped  = exclude;
    exclude = encode.defaultChars;
  }

  if (typeof keepEscaped === 'undefined') {
    keepEscaped = true;
  }

  cache = getEncodeCache(exclude);

  for (i = 0, l = string.length; i < l; i++) {
    code = string.charCodeAt(i);

    if (keepEscaped && code === 0x25 /* % */ && i + 2 < l) {
      if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
        result += string.slice(i, i + 3);
        i += 2;
        continue;
      }
    }

    if (code < 128) {
      result += cache[code];
      continue;
    }

    if (code >= 0xD800 && code <= 0xDFFF) {
      if (code >= 0xD800 && code <= 0xDBFF && i + 1 < l) {
        nextCode = string.charCodeAt(i + 1);
        if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
          result += encodeURIComponent(string[i] + string[i + 1]);
          i++;
          continue;
        }
      }
      result += '%EF%BF%BD';
      continue;
    }

    result += encodeURIComponent(string[i]);
  }

  return result;
}

encode.defaultChars   = ";/?:@&=+$,-_.!~*'()#";
encode.componentChars = "-_.!~*'()";


var encode_1 = encode;

/**
 * @typedef {import('mdast').LinkReference} LinkReference
 * @typedef {import('mdast').ImageReference} ImageReference
 * @typedef {import('./index.js').Handler} Handler
 * @typedef {import('./index.js').Content} Content
 */

/**
 * Return the content of a reference without definition as plain text.
 *
 * @type {Handler}
 * @param {ImageReference|LinkReference} node
 * @returns {Content|Array.<Content>}
 */
function revert(h, node) {
  var subtype = node.referenceType;
  var suffix = ']';
  /** @type {Array.<Content>} */
  var contents;
  /** @type {Content} */
  var head;
  /** @type {Content} */
  var tail;

  if (subtype === 'collapsed') {
    suffix += '[]';
  } else if (subtype === 'full') {
    suffix += '[' + (node.label || node.identifier) + ']';
  }

  if (node.type === 'imageReference') {
    return u('text', '![' + node.alt + suffix)
  }

  contents = all$1(h, node);
  head = contents[0];

  if (head && head.type === 'text') {
    head.value = '[' + head.value;
  } else {
    contents.unshift(u('text', '['));
  }

  tail = contents[contents.length - 1];

  if (tail && tail.type === 'text') {
    tail.value += suffix;
  } else {
    contents.push(u('text', suffix));
  }

  return contents
}

/**
 * @typedef {import('mdast').ImageReference} ImageReference
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {ImageReference} node
 */
function imageReference(h, node) {
  var def = h.definition(node.identifier);
  /** @type {Properties} */
  var props;

  if (!def) {
    return revert(h, node)
  }

  props = {src: encode_1(def.url || ''), alt: node.alt};

  if (def.title !== null && def.title !== undefined) {
    props.title = def.title;
  }

  return h(node, 'img', props)
}

/**
 * @typedef {import('mdast').Image} Image
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {Image} node
 */
function image(h, node) {
  /** @type {Properties} */
  var props = {src: encode_1(node.url), alt: node.alt};

  if (node.title !== null && node.title !== undefined) {
    props.title = node.title;
  }

  return h(node, 'img', props)
}

/**
 * @typedef {import('mdast').InlineCode} InlineCode
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {InlineCode} node
 */
function inlineCode(h, node) {
  return h(node, 'code', [u('text', node.value.replace(/\r?\n|\r/g, ' '))])
}

/**
 * @typedef {import('mdast').LinkReference} LinkReference
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {LinkReference} node
 */
function linkReference(h, node) {
  var def = h.definition(node.identifier);
  /** @type {Properties} */
  var props;

  if (!def) {
    return revert(h, node)
  }

  props = {href: encode_1(def.url || '')};

  if (def.title !== null && def.title !== undefined) {
    props.title = def.title;
  }

  return h(node, 'a', props, all$1(h, node))
}

/**
 * @typedef {import('mdast').Link} Link
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {Link} node
 */
function link(h, node) {
  /** @type {Properties} */
  var props = {href: encode_1(node.url)};

  if (node.title !== null && node.title !== undefined) {
    props.title = node.title;
  }

  return h(node, 'a', props, all$1(h, node))
}

/**
 * @typedef {import('mdast').ListItem} ListItem
 * @typedef {import('mdast').List} List
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('hast').Element} Element
 * @typedef {import('../index.js').Handler} Handler
 * @typedef {import('../index.js').Content} Content
 */

/**
 * @type {Handler}
 * @param {ListItem} node
 * @param {List} parent
 */
function listItem(h, node, parent) {
  var result = all$1(h, node);
  var loose = parent ? listLoose(parent) : listItemLoose(node);
  /** @type {Properties} */
  var props = {};
  /** @type {Array.<Content>} */
  var wrapped = [];
  /** @type {number} */
  var index;
  /** @type {Element} */
  var paragraph;
  /** @type {Content} */
  var child;

  if (typeof node.checked === 'boolean') {
    if (
      result[0] &&
      result[0].type === 'element' &&
      result[0].tagName === 'p'
    ) {
      paragraph = result[0];
    } else {
      paragraph = h(null, 'p', []);
      result.unshift(paragraph);
    }

    if (paragraph.children.length > 0) {
      paragraph.children.unshift(u('text', ' '));
    }

    paragraph.children.unshift(
      h(null, 'input', {
        type: 'checkbox',
        checked: node.checked,
        disabled: true
      })
    );

    // According to github-markdown-css, this class hides bullet.
    // See: <https://github.com/sindresorhus/github-markdown-css>.
    props.className = ['task-list-item'];
  }

  index = -1;

  while (++index < result.length) {
    child = result[index];

    // Add eols before nodes, except if this is a loose, first paragraph.
    if (
      loose ||
      index !== 0 ||
      child.type !== 'element' ||
      child.tagName !== 'p'
    ) {
      wrapped.push(u('text', '\n'));
    }

    if (child.type === 'element' && child.tagName === 'p' && !loose) {
      wrapped.push(...child.children);
    } else {
      wrapped.push(child);
    }
  }

  // Add a final eol.
  if (result.length > 0 && (loose || child.tagName !== 'p')) {
    wrapped.push(u('text', '\n'));
  }

  return h(node, 'li', props, wrapped)
}

/**
 * @param {List} node
 * @return {Boolean}
 */
function listLoose(node) {
  var loose = node.spread;
  var children = node.children;
  var index = -1;

  while (!loose && ++index < children.length) {
    loose = listItemLoose(children[index]);
  }

  return loose
}

/**
 * @param {ListItem} node
 * @return {Boolean}
 */
function listItemLoose(node) {
  var spread = node.spread;

  return spread === undefined || spread === null
    ? node.children.length > 1
    : spread
}

/**
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {Paragraph} node
 */
function paragraph(h, node) {
  return h(node, 'p', all$1(h, node))
}

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {Root} node
 */
function root(h, node) {
  // @ts-ignore top-level is a root.
  return h.augment(node, u('root', wrap(all$1(h, node))))
}

/**
 * @typedef {import('mdast').Strong} Strong
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {Strong} node
 */
function strong(h, node) {
  return h(node, 'strong', all$1(h, node))
}

/**
 * @typedef {import('mdast').Table} Table
 * @typedef {import('mdast').TableCell} TableCell
 * @typedef {import('hast').Element} Element
 * @typedef {import('../index.js').Handler} Handler
 * @typedef {import('../index.js').Content} Content
 */

/**
 * @type {Handler}
 * @param {Table} node
 */
function table(h, node) {
  var rows = node.children;
  var index = rows.length;
  var align = node.align || [];
  /** @type {Array.<Element>} */
  var result = [];
  /** @type {number} */
  var pos;
  /** @type {Array.<TableCell>} */
  var row;
  /** @type {Array.<Content>} */
  var out;
  /** @type {string} */
  var name;
  /** @type {TableCell} */
  var cell;

  while (index--) {
    row = rows[index].children;
    name = index === 0 ? 'th' : 'td';
    pos = node.align ? align.length : row.length;
    out = [];

    while (pos--) {
      cell = row[pos];
      out[pos] = h(cell, name, {align: align[pos]}, cell ? all$1(h, cell) : []);
    }

    result[index] = h(rows[index], 'tr', wrap(out, true));
  }

  return h(
    node,
    'table',
    wrap(
      [h(result[0].position, 'thead', wrap([result[0]], true))].concat(
        result[1]
          ? h(
              {
                start: pointStart(result[1]),
                end: pointEnd(result[result.length - 1])
              },
              'tbody',
              wrap(result.slice(1), true)
            )
          : []
      ),
      true
    )
  )
}

/**
 * @typedef {import('mdast').Text} Text
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {Text} node
 */
function text$1(h, node) {
  return h.augment(
    node,
    u('text', String(node.value).replace(/[ \t]*(\r?\n|\r)[ \t]*/g, '$1'))
  )
}

const handlers$1 = {
  blockquote,
  break: hardBreak,
  code,
  delete: strikethrough,
  emphasis,
  footnoteReference,
  footnote,
  heading,
  html: html$4,
  imageReference,
  image,
  inlineCode,
  linkReference,
  link,
  listItem,
  list,
  paragraph,
  root,
  strong,
  table,
  text: text$1,
  thematicBreak,
  toml: ignore,
  yaml: ignore,
  definition: ignore,
  footnoteDefinition: ignore
};

// Return nothing for nodes that are ignored.
function ignore() {
  return null
}

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('mdast').Definition} Definition
 * @typedef {import('mdast').FootnoteDefinition} FootnoteDefinition
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('hast').Text} Text
 * @typedef {import('hast').Comment} Comment
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Root} Root
 * @typedef {import('unist-util-position').NodeLike} NodeLikeWithPosition
 * @typedef {import('unist-util-position').PositionLike} PositionLike
 * @typedef {import('unist-util-visit').Visitor<FootnoteDefinition>} FootnoteDefinitionVisitor
 *
 * @typedef {Element|Text|Comment} Content
 *
 * @typedef EmbeddedHastFields
 * @property {string} [hName] Defines the tag name of an element
 * @property {Properties} [hProperties] Defines the properties of an element
 * @property {Array.<Content>} [hChildren] Defines the (hast) children of an element
 *
 * @typedef {Object.<string, unknown> & EmbeddedHastFields} Data unist data with embedded hast fields
 *
 * @typedef {Node & {data?: Data}} NodeWithData unist node with embedded hast data
 *
 * @callback Handler
 * @param {H} h Handle context
 * @param {Node} node mdast node to handle
 * @param {Parent|null} parent Parent of `node`
 * @returns {Content|Array.<Content>|null|undefined} hast node
 *
 * @callback HFunctionProps
 * @param {Node|PositionLike|null|undefined} node mdast node or unist position
 * @param {string} tagName HTML tag name
 * @param {Properties} props Properties
 * @param {Array.<Content>?} [children] hast content
 * @returns {Element}
 *
 * @callback HFunctionNoProps
 * @param {Node|PositionLike|null|undefined} node mdast node or unist position
 * @param {string} tagName HTML tag name
 * @param {Array.<Content>?} [children] hast content
 * @returns {Element}
 *
 * @typedef HFields
 * @property {boolean} dangerous Whether HTML is allowed
 * @property {(identifier: string) => Definition|null} definition Definition cache
 * @property {Object.<string, FootnoteDefinition>} footnoteById Footnote cache
 * @property {Array.<string>} footnoteOrder Order in which footnotes occur
 * @property {Handlers} handlers Applied handlers
 * @property {Handler} unknownHandler Handler for any none not in `passThrough` or otherwise handled
 * @property {(left: NodeWithData|PositionLike|null|undefined, right: Content) => Content} augment Like `h` but lower-level and usable on non-elements.
 * @property {Array.<string>} passThrough List of node types to pass through untouched (except for their children).
 *
 * @typedef Options
 * @property {boolean} [allowDangerousHtml=false] Whether to allow `html` nodes and inject them as `raw` HTML
 * @property {Handlers} [handlers] Object mapping mdast nodes to functions handling them
 * @property {Array.<string>} [passThrough] List of custom mdast node types to pass through (keep) in hast
 * @property {Handler} [unknownHandler] Handler for all unknown nodes.
 *
 * @typedef {Record.<string, Handler>} Handlers Map of node types to handlers
 * @typedef {HFunctionProps & HFunctionNoProps & HFields} H Handle context
 */

var own$5 = {}.hasOwnProperty;

/**
 * Factory to transform.
 * @param {Node} tree mdast node
 * @param {Options} [options] Configuration
 * @returns {H} `h` function
 */
function factory(tree, options) {
  var settings = options || {};
  var dangerous = settings.allowDangerousHtml || false;
  /** @type {Object.<string, FootnoteDefinition>} */
  var footnoteById = {};

  h.dangerous = dangerous;
  h.definition = definitions(tree);
  h.footnoteById = footnoteById;
  /** @type {Array.<string>} */
  h.footnoteOrder = [];
  h.augment = augment;
  h.handlers = {...handlers$1, ...settings.handlers};
  h.unknownHandler = settings.unknownHandler;
  h.passThrough = settings.passThrough;

  visit(tree, 'footnoteDefinition', onfootnotedefinition);

  // @ts-ignore Hush, it’s fine!
  return h

  /**
   * Finalise the created `right`, a hast node, from `left`, an mdast node.
   * @param {(NodeWithData|PositionLike)?} left
   * @param {Content} right
   * @returns {Content}
   */
  function augment(left, right) {
    /** @type {Data} */
    var data;
    /** @type {NodeLikeWithPosition} */
    var ctx;

    // Handle `data.hName`, `data.hProperties, `data.hChildren`.
    if (left && 'data' in left && left.data) {
      data = left.data;

      if (data.hName) {
        if (right.type !== 'element') {
          right = {
            type: 'element',
            tagName: '',
            properties: {},
            children: []
          };
        }

        right.tagName = data.hName;
      }

      if (right.type === 'element' && data.hProperties) {
        right.properties = {...right.properties, ...data.hProperties};
      }

      if ('children' in right && right.children && data.hChildren) {
        right.children = data.hChildren;
      }
    }

    if (left) {
      // @ts-ignore looks like a node vs. position.
      ctx = 'type' in left ? left : {position: left};

      if (!generated(ctx)) {
        right.position = {start: pointStart(ctx), end: pointEnd(ctx)};
      }
    }

    return right
  }

  /**
   * Create an element for `node`.
   *
   * @type {HFunctionProps}
   */
  function h(node, tagName, props, children) {
    if (Array.isArray(props)) {
      children = props;
      props = {};
    }

    // @ts-ignore augmenting an element yields an element.
    return augment(node, {
      type: 'element',
      tagName,
      properties: props || {},
      children: children || []
    })
  }

  /**
   * @type {FootnoteDefinitionVisitor}
   */
  function onfootnotedefinition(definition) {
    var id = String(definition.identifier).toUpperCase();

    // Mimick CM behavior of link definitions.
    // See: <https://github.com/syntax-tree/mdast-util-definitions/blob/8290999/index.js#L26>.
    if (!own$5.call(footnoteById, id)) {
      footnoteById[id] = definition;
    }
  }
}

/**
 * Transform `tree` (an mdast node) to a hast node.
 *
 * @param {Node} tree mdast node
 * @param {Options} [options] Configuration
 * @returns {Node} hast node
 */
function toHast(tree, options) {
  var h = factory(tree, options);
  var node = one$1(h, tree, null);
  var foot = footer(h);

  if (foot) {
    // @ts-ignore If there’s a footer, there were definitions, meaning block
    // content.
    // So assume `node` is a parent node.
    node.children.push(u('text', '\n'), foot);
  }

  return Array.isArray(node) ? {type: 'root', children: node} : node
}

/**
 * @typedef {import('./info.js').Info} Info
 * @typedef {Object.<string, Info>} Properties
 * @typedef {Object.<string, string>} Normal
 */

class Schema {
  /**
   * @constructor
   * @param {Properties} property
   * @param {Normal} normal
   * @param {string} [space]
   */
  constructor(property, normal, space) {
    this.property = property;
    this.normal = normal;
    if (space) {
      this.space = space;
    }
  }
}

/** @type {Properties} */
Schema.prototype.property = {};
/** @type {Normal} */
Schema.prototype.normal = {};
/** @type {string|null} */
Schema.prototype.space = null;

/**
 * @typedef {import('./schema.js').Properties} Properties
 * @typedef {import('./schema.js').Normal} Normal
 */

/**
 * @param {import('./schema.js').Schema[]} definitions
 * @param {string} space
 * @returns {import('./schema.js').Schema}
 */
function merge(definitions, space) {
  /** @type {Properties} */
  var property = {};
  /** @type {Normal} */
  var normal = {};
  var index = -1;

  while (++index < definitions.length) {
    Object.assign(property, definitions[index].property);
    Object.assign(normal, definitions[index].normal);
  }

  return new Schema(property, normal, space)
}

/**
 * @param {string} value
 * @returns {string}
 */
function normalize(value) {
  return value.toLowerCase()
}

class Info {
  /**
   * @constructor
   * @param {string} property
   * @param {string} attribute
   */
  constructor(property, attribute) {
    this.property = property;
    this.attribute = attribute;
  }
}

/** @type {string|null} */
Info.prototype.space = null;
Info.prototype.attribute = null;
Info.prototype.property = null;
Info.prototype.boolean = false;
Info.prototype.booleanish = false;
Info.prototype.overloadedBoolean = false;
Info.prototype.number = false;
Info.prototype.commaSeparated = false;
Info.prototype.spaceSeparated = false;
Info.prototype.commaOrSpaceSeparated = false;
Info.prototype.mustUseProperty = false;
Info.prototype.defined = false;

var powers = 0;

var boolean = increment();
var booleanish = increment();
var overloadedBoolean = increment();
var number = increment();
var spaceSeparated = increment();
var commaSeparated = increment();
var commaOrSpaceSeparated = increment();

function increment() {
  return 2 ** ++powers
}

var types = /*#__PURE__*/Object.freeze({
	__proto__: null,
	boolean: boolean,
	booleanish: booleanish,
	overloadedBoolean: overloadedBoolean,
	number: number,
	spaceSeparated: spaceSeparated,
	commaSeparated: commaSeparated,
	commaOrSpaceSeparated: commaOrSpaceSeparated
});

var checks = Object.keys(types);

class DefinedInfo extends Info {
  /**
   * @constructor
   * @param {string} property
   * @param {string} attribute
   * @param {number} [mask]
   * @param {string} [space]
   */
  constructor(property, attribute, mask, space) {
    var index = -1;

    super(property, attribute);

    mark(this, 'space', space);

    while (++index < checks.length) {
      mark(
        this,
        checks[index],
        (mask & types[checks[index]]) === types[checks[index]]
      );
    }
  }
}

DefinedInfo.prototype.defined = true;

/**
 * @param {InstanceType<typeof DefinedInfo>} values
 * @param {string} key
 * @param {unknown} value
 */
function mark(values, key, value) {
  if (value) {
    values[key] = value;
  }
}

/**
 * @typedef {import('./schema.js').Properties} Properties
 * @typedef {import('./schema.js').Normal} Normal
 * @typedef {import('./info.js').Info} Info
 */

/**
 * @typedef {Object.<string, string>} Attributes
 *
 * @typedef {Object} Definition
 * @property {Object.<string, number|null>} properties
 * @property {(attributes: Attributes, property: string) => string} transform
 * @property {string} [space]
 * @property {Attributes} [attributes]
 * @property {Array.<string>} [mustUseProperty]
 */

var own$4 = {}.hasOwnProperty;

/**
 * @param {Definition} definition
 * @returns {import('./schema.js').Schema}
 */
function create(definition) {
  /** @type {Properties} */
  var property = {};
  /** @type {Normal} */
  var normal = {};
  /** @type {string} */
  var prop;
  /** @type {Info} */
  var info;

  for (prop in definition.properties) {
    if (own$4.call(definition.properties, prop)) {
      info = new DefinedInfo(
        prop,
        definition.transform(definition.attributes, prop),
        definition.properties[prop],
        definition.space
      );

      if (
        definition.mustUseProperty &&
        definition.mustUseProperty.includes(prop)
      ) {
        info.mustUseProperty = true;
      }

      property[prop] = info;

      normal[normalize(prop)] = prop;
      normal[normalize(info.attribute)] = prop;
    }
  }

  return new Schema(property, normal, definition.space)
}

var xlink = create({
  space: 'xlink',
  transform: xlinkTransform,
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  }
});

/**
 * @param {unknown} _
 * @param {string} prop
 * @returns {string}
 */
function xlinkTransform(_, prop) {
  return 'xlink:' + prop.slice(5).toLowerCase()
}

var xml = create({
  space: 'xml',
  transform: xmlTransform,
  properties: {xmlLang: null, xmlBase: null, xmlSpace: null}
});

/**
 * @param {unknown} _
 * @param {string} prop
 * @returns {string}
 */
function xmlTransform(_, prop) {
  return 'xml:' + prop.slice(3).toLowerCase()
}

/**
 * @param {Object.<string, string>} attributes
 * @param {string} attribute
 * @returns {string}
 */
function caseSensitiveTransform(attributes, attribute) {
  return attribute in attributes ? attributes[attribute] : attribute
}

/**
 * @param {Object.<string, string>} attributes
 * @param {string} property
 * @returns {string}
 */
function caseInsensitiveTransform(attributes, property) {
  return caseSensitiveTransform(attributes, property.toLowerCase())
}

var xmlns = create({
  space: 'xmlns',
  attributes: {xmlnsxlink: 'xmlns:xlink'},
  transform: caseInsensitiveTransform,
  properties: {xmlns: null, xmlnsXLink: null}
});

var aria = create({
  transform: ariaTransform,
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: booleanish,
    ariaAutoComplete: null,
    ariaBusy: booleanish,
    ariaChecked: booleanish,
    ariaColCount: number,
    ariaColIndex: number,
    ariaColSpan: number,
    ariaControls: spaceSeparated,
    ariaCurrent: null,
    ariaDescribedBy: spaceSeparated,
    ariaDetails: null,
    ariaDisabled: booleanish,
    ariaDropEffect: spaceSeparated,
    ariaErrorMessage: null,
    ariaExpanded: booleanish,
    ariaFlowTo: spaceSeparated,
    ariaGrabbed: booleanish,
    ariaHasPopup: null,
    ariaHidden: booleanish,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: spaceSeparated,
    ariaLevel: number,
    ariaLive: null,
    ariaModal: booleanish,
    ariaMultiLine: booleanish,
    ariaMultiSelectable: booleanish,
    ariaOrientation: null,
    ariaOwns: spaceSeparated,
    ariaPlaceholder: null,
    ariaPosInSet: number,
    ariaPressed: booleanish,
    ariaReadOnly: booleanish,
    ariaRelevant: null,
    ariaRequired: booleanish,
    ariaRoleDescription: spaceSeparated,
    ariaRowCount: number,
    ariaRowIndex: number,
    ariaRowSpan: number,
    ariaSelected: booleanish,
    ariaSetSize: number,
    ariaSort: null,
    ariaValueMax: number,
    ariaValueMin: number,
    ariaValueNow: number,
    ariaValueText: null,
    role: null
  }
});

/**
 * @param {unknown} _
 * @param {string} prop
 * @returns {string}
 */
function ariaTransform(_, prop) {
  return prop === 'role' ? prop : 'aria-' + prop.slice(4).toLowerCase()
}

var html$3 = create({
  space: 'html',
  attributes: {
    acceptcharset: 'accept-charset',
    classname: 'class',
    htmlfor: 'for',
    httpequiv: 'http-equiv'
  },
  transform: caseInsensitiveTransform,
  mustUseProperty: ['checked', 'multiple', 'muted', 'selected'],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: commaSeparated,
    acceptCharset: spaceSeparated,
    accessKey: spaceSeparated,
    action: null,
    allow: null,
    allowFullScreen: boolean,
    allowPaymentRequest: boolean,
    allowUserMedia: boolean,
    alt: null,
    as: null,
    async: boolean,
    autoCapitalize: null,
    autoComplete: spaceSeparated,
    autoFocus: boolean,
    autoPlay: boolean,
    capture: boolean,
    charSet: null,
    checked: boolean,
    cite: null,
    className: spaceSeparated,
    cols: number,
    colSpan: null,
    content: null,
    contentEditable: booleanish,
    controls: boolean,
    controlsList: spaceSeparated,
    coords: number | commaSeparated,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: boolean,
    defer: boolean,
    dir: null,
    dirName: null,
    disabled: boolean,
    download: overloadedBoolean,
    draggable: booleanish,
    encType: null,
    enterKeyHint: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: boolean,
    formTarget: null,
    headers: spaceSeparated,
    height: number,
    hidden: boolean,
    high: number,
    href: null,
    hrefLang: null,
    htmlFor: spaceSeparated,
    httpEquiv: spaceSeparated,
    id: null,
    imageSizes: null,
    imageSrcSet: commaSeparated,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: boolean,
    itemId: null,
    itemProp: spaceSeparated,
    itemRef: spaceSeparated,
    itemScope: boolean,
    itemType: spaceSeparated,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: boolean,
    low: number,
    manifest: null,
    max: null,
    maxLength: number,
    media: null,
    method: null,
    min: null,
    minLength: number,
    multiple: boolean,
    muted: boolean,
    name: null,
    nonce: null,
    noModule: boolean,
    noValidate: boolean,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforePrint: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextMenu: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: boolean,
    optimum: number,
    pattern: null,
    ping: spaceSeparated,
    placeholder: null,
    playsInline: boolean,
    poster: null,
    preload: null,
    readOnly: boolean,
    referrerPolicy: null,
    rel: spaceSeparated,
    required: boolean,
    reversed: boolean,
    rows: number,
    rowSpan: number,
    sandbox: spaceSeparated,
    scope: null,
    scoped: boolean,
    seamless: boolean,
    selected: boolean,
    shape: null,
    size: number,
    sizes: null,
    slot: null,
    span: number,
    spellCheck: booleanish,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: commaSeparated,
    start: number,
    step: null,
    style: null,
    tabIndex: number,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: boolean,
    useMap: null,
    value: booleanish,
    width: number,
    wrap: null,

    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null, // Several. Use CSS `text-align` instead,
    aLink: null, // `<body>`. Use CSS `a:active {color}` instead
    archive: spaceSeparated, // `<object>`. List of URIs to archives
    axis: null, // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null, // `<body>`. Use CSS `background-image` instead
    bgColor: null, // `<body>` and table elements. Use CSS `background-color` instead
    border: number, // `<table>`. Use CSS `border-width` instead,
    borderColor: null, // `<table>`. Use CSS `border-color` instead,
    bottomMargin: number, // `<body>`
    cellPadding: null, // `<table>`
    cellSpacing: null, // `<table>`
    char: null, // Several table elements. When `align=char`, sets the character to align on
    charOff: null, // Several table elements. When `char`, offsets the alignment
    classId: null, // `<object>`
    clear: null, // `<br>`. Use CSS `clear` instead
    code: null, // `<object>`
    codeBase: null, // `<object>`
    codeType: null, // `<object>`
    color: null, // `<font>` and `<hr>`. Use CSS instead
    compact: boolean, // Lists. Use CSS to reduce space between items instead
    declare: boolean, // `<object>`
    event: null, // `<script>`
    face: null, // `<font>`. Use CSS instead
    frame: null, // `<table>`
    frameBorder: null, // `<iframe>`. Use CSS `border` instead
    hSpace: number, // `<img>` and `<object>`
    leftMargin: number, // `<body>`
    link: null, // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null, // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null, // `<img>`. Use a `<picture>`
    marginHeight: number, // `<body>`
    marginWidth: number, // `<body>`
    noResize: boolean, // `<frame>`
    noHref: boolean, // `<area>`. Use no href instead of an explicit `nohref`
    noShade: boolean, // `<hr>`. Use background-color and height instead of borders
    noWrap: boolean, // `<td>` and `<th>`
    object: null, // `<applet>`
    profile: null, // `<head>`
    prompt: null, // `<isindex>`
    rev: null, // `<link>`
    rightMargin: number, // `<body>`
    rules: null, // `<table>`
    scheme: null, // `<meta>`
    scrolling: booleanish, // `<frame>`. Use overflow in the child context
    standby: null, // `<object>`
    summary: null, // `<table>`
    text: null, // `<body>`. Use CSS `color` instead
    topMargin: number, // `<body>`
    valueType: null, // `<param>`
    version: null, // `<html>`. Use a doctype.
    vAlign: null, // Several. Use CSS `vertical-align` instead
    vLink: null, // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: number, // `<img>` and `<object>`

    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    disablePictureInPicture: boolean,
    disableRemotePlayback: boolean,
    prefix: null,
    property: null,
    results: number,
    security: null,
    unselectable: null
  }
});

var svg$1 = create({
  space: 'svg',
  attributes: {
    accentHeight: 'accent-height',
    alignmentBaseline: 'alignment-baseline',
    arabicForm: 'arabic-form',
    baselineShift: 'baseline-shift',
    capHeight: 'cap-height',
    className: 'class',
    clipPath: 'clip-path',
    clipRule: 'clip-rule',
    colorInterpolation: 'color-interpolation',
    colorInterpolationFilters: 'color-interpolation-filters',
    colorProfile: 'color-profile',
    colorRendering: 'color-rendering',
    crossOrigin: 'crossorigin',
    dataType: 'datatype',
    dominantBaseline: 'dominant-baseline',
    enableBackground: 'enable-background',
    fillOpacity: 'fill-opacity',
    fillRule: 'fill-rule',
    floodColor: 'flood-color',
    floodOpacity: 'flood-opacity',
    fontFamily: 'font-family',
    fontSize: 'font-size',
    fontSizeAdjust: 'font-size-adjust',
    fontStretch: 'font-stretch',
    fontStyle: 'font-style',
    fontVariant: 'font-variant',
    fontWeight: 'font-weight',
    glyphName: 'glyph-name',
    glyphOrientationHorizontal: 'glyph-orientation-horizontal',
    glyphOrientationVertical: 'glyph-orientation-vertical',
    hrefLang: 'hreflang',
    horizAdvX: 'horiz-adv-x',
    horizOriginX: 'horiz-origin-x',
    horizOriginY: 'horiz-origin-y',
    imageRendering: 'image-rendering',
    letterSpacing: 'letter-spacing',
    lightingColor: 'lighting-color',
    markerEnd: 'marker-end',
    markerMid: 'marker-mid',
    markerStart: 'marker-start',
    navDown: 'nav-down',
    navDownLeft: 'nav-down-left',
    navDownRight: 'nav-down-right',
    navLeft: 'nav-left',
    navNext: 'nav-next',
    navPrev: 'nav-prev',
    navRight: 'nav-right',
    navUp: 'nav-up',
    navUpLeft: 'nav-up-left',
    navUpRight: 'nav-up-right',
    onAbort: 'onabort',
    onActivate: 'onactivate',
    onAfterPrint: 'onafterprint',
    onBeforePrint: 'onbeforeprint',
    onBegin: 'onbegin',
    onCancel: 'oncancel',
    onCanPlay: 'oncanplay',
    onCanPlayThrough: 'oncanplaythrough',
    onChange: 'onchange',
    onClick: 'onclick',
    onClose: 'onclose',
    onCopy: 'oncopy',
    onCueChange: 'oncuechange',
    onCut: 'oncut',
    onDblClick: 'ondblclick',
    onDrag: 'ondrag',
    onDragEnd: 'ondragend',
    onDragEnter: 'ondragenter',
    onDragExit: 'ondragexit',
    onDragLeave: 'ondragleave',
    onDragOver: 'ondragover',
    onDragStart: 'ondragstart',
    onDrop: 'ondrop',
    onDurationChange: 'ondurationchange',
    onEmptied: 'onemptied',
    onEnd: 'onend',
    onEnded: 'onended',
    onError: 'onerror',
    onFocus: 'onfocus',
    onFocusIn: 'onfocusin',
    onFocusOut: 'onfocusout',
    onHashChange: 'onhashchange',
    onInput: 'oninput',
    onInvalid: 'oninvalid',
    onKeyDown: 'onkeydown',
    onKeyPress: 'onkeypress',
    onKeyUp: 'onkeyup',
    onLoad: 'onload',
    onLoadedData: 'onloadeddata',
    onLoadedMetadata: 'onloadedmetadata',
    onLoadStart: 'onloadstart',
    onMessage: 'onmessage',
    onMouseDown: 'onmousedown',
    onMouseEnter: 'onmouseenter',
    onMouseLeave: 'onmouseleave',
    onMouseMove: 'onmousemove',
    onMouseOut: 'onmouseout',
    onMouseOver: 'onmouseover',
    onMouseUp: 'onmouseup',
    onMouseWheel: 'onmousewheel',
    onOffline: 'onoffline',
    onOnline: 'ononline',
    onPageHide: 'onpagehide',
    onPageShow: 'onpageshow',
    onPaste: 'onpaste',
    onPause: 'onpause',
    onPlay: 'onplay',
    onPlaying: 'onplaying',
    onPopState: 'onpopstate',
    onProgress: 'onprogress',
    onRateChange: 'onratechange',
    onRepeat: 'onrepeat',
    onReset: 'onreset',
    onResize: 'onresize',
    onScroll: 'onscroll',
    onSeeked: 'onseeked',
    onSeeking: 'onseeking',
    onSelect: 'onselect',
    onShow: 'onshow',
    onStalled: 'onstalled',
    onStorage: 'onstorage',
    onSubmit: 'onsubmit',
    onSuspend: 'onsuspend',
    onTimeUpdate: 'ontimeupdate',
    onToggle: 'ontoggle',
    onUnload: 'onunload',
    onVolumeChange: 'onvolumechange',
    onWaiting: 'onwaiting',
    onZoom: 'onzoom',
    overlinePosition: 'overline-position',
    overlineThickness: 'overline-thickness',
    paintOrder: 'paint-order',
    panose1: 'panose-1',
    pointerEvents: 'pointer-events',
    referrerPolicy: 'referrerpolicy',
    renderingIntent: 'rendering-intent',
    shapeRendering: 'shape-rendering',
    stopColor: 'stop-color',
    stopOpacity: 'stop-opacity',
    strikethroughPosition: 'strikethrough-position',
    strikethroughThickness: 'strikethrough-thickness',
    strokeDashArray: 'stroke-dasharray',
    strokeDashOffset: 'stroke-dashoffset',
    strokeLineCap: 'stroke-linecap',
    strokeLineJoin: 'stroke-linejoin',
    strokeMiterLimit: 'stroke-miterlimit',
    strokeOpacity: 'stroke-opacity',
    strokeWidth: 'stroke-width',
    tabIndex: 'tabindex',
    textAnchor: 'text-anchor',
    textDecoration: 'text-decoration',
    textRendering: 'text-rendering',
    typeOf: 'typeof',
    underlinePosition: 'underline-position',
    underlineThickness: 'underline-thickness',
    unicodeBidi: 'unicode-bidi',
    unicodeRange: 'unicode-range',
    unitsPerEm: 'units-per-em',
    vAlphabetic: 'v-alphabetic',
    vHanging: 'v-hanging',
    vIdeographic: 'v-ideographic',
    vMathematical: 'v-mathematical',
    vectorEffect: 'vector-effect',
    vertAdvY: 'vert-adv-y',
    vertOriginX: 'vert-origin-x',
    vertOriginY: 'vert-origin-y',
    wordSpacing: 'word-spacing',
    writingMode: 'writing-mode',
    xHeight: 'x-height',
    // These were camelcased in Tiny. Now lowercased in SVG 2
    playbackOrder: 'playbackorder',
    timelineBegin: 'timelinebegin'
  },
  transform: caseSensitiveTransform,
  properties: {
    about: commaOrSpaceSeparated,
    accentHeight: number,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: number,
    amplitude: number,
    arabicForm: null,
    ascent: number,
    attributeName: null,
    attributeType: null,
    azimuth: number,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: number,
    by: null,
    calcMode: null,
    capHeight: number,
    className: spaceSeparated,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: number,
    diffuseConstant: number,
    direction: null,
    display: null,
    dur: null,
    divisor: number,
    dominantBaseline: null,
    download: boolean,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: number,
    enableBackground: null,
    end: null,
    event: null,
    exponent: number,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: number,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: commaSeparated,
    g2: commaSeparated,
    glyphName: commaSeparated,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: number,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: number,
    horizOriginX: number,
    horizOriginY: number,
    id: null,
    ideographic: number,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: number,
    k: number,
    k1: number,
    k2: number,
    k3: number,
    k4: number,
    kernelMatrix: commaOrSpaceSeparated,
    kernelUnitLength: null,
    keyPoints: null, // SEMI_COLON_SEPARATED
    keySplines: null, // SEMI_COLON_SEPARATED
    keyTimes: null, // SEMI_COLON_SEPARATED
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: number,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: number,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: number,
    overlineThickness: number,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: number,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: spaceSeparated,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: number,
    pointsAtY: number,
    pointsAtZ: number,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: commaOrSpaceSeparated,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: commaOrSpaceSeparated,
    rev: commaOrSpaceSeparated,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: commaOrSpaceSeparated,
    requiredFeatures: commaOrSpaceSeparated,
    requiredFonts: commaOrSpaceSeparated,
    requiredFormats: commaOrSpaceSeparated,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: number,
    specularExponent: number,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: number,
    strikethroughThickness: number,
    string: null,
    stroke: null,
    strokeDashArray: commaOrSpaceSeparated,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: number,
    strokeOpacity: number,
    strokeWidth: null,
    style: null,
    surfaceScale: number,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: commaOrSpaceSeparated,
    tabIndex: number,
    tableValues: null,
    target: null,
    targetX: number,
    targetY: number,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: commaOrSpaceSeparated,
    to: null,
    transform: null,
    u1: null,
    u2: null,
    underlinePosition: number,
    underlineThickness: number,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: number,
    values: null,
    vAlphabetic: number,
    vMathematical: number,
    vectorEffect: null,
    vHanging: number,
    vIdeographic: number,
    version: null,
    vertAdvY: number,
    vertOriginX: number,
    vertOriginY: number,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: number,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  }
});

var valid = /^data[-\w.:]+$/i;
var dash = /-[a-z]/g;
var cap = /[A-Z]/g;

/**
 * @param {import('./util/schema.js').Schema} schema
 * @param {string} value
 * @returns {import('./util/info.js').Info}
 */
function find(schema, value) {
  var normal = normalize(value);
  var prop = value;
  var Type = Info;

  if (normal in schema.normal) {
    return schema.property[schema.normal[normal]]
  }

  if (normal.length > 4 && normal.slice(0, 4) === 'data' && valid.test(value)) {
    // Attribute or property.
    if (value.charAt(4) === '-') {
      prop = datasetToProperty(value);
    } else {
      value = datasetToAttribute(value);
    }

    Type = DefinedInfo;
  }

  return new Type(prop, value)
}

/**
 * @param {string} attribute
 * @returns {string}
 */
function datasetToProperty(attribute) {
  var value = attribute.slice(5).replace(dash, camelcase);
  return 'data' + value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 * @param {string} property
 * @returns {string}
 */
function datasetToAttribute(property) {
  var value = property.slice(4);

  if (dash.test(value)) {
    return property
  }

  value = value.replace(cap, kebab);

  if (value.charAt(0) !== '-') {
    value = '-' + value;
  }

  return 'data' + value
}

/**
 * @param {string} $0
 * @returns {string}
 */
function kebab($0) {
  return '-' + $0.toLowerCase()
}

/**
 * @param {string} $0
 * @returns {string}
 */
function camelcase($0) {
  return $0.charAt(1).toUpperCase()
}

/**
 * @typedef {import('./lib/util/info.js').Info} Info
 * @typedef {import('./lib/util/schema.js').Schema} Schema
 */
var html$2 = merge([xml, xlink, xmlns, aria, html$3], 'html');
var svg = merge([xml, xlink, xmlns, aria, svg$1], 'svg');

var htmlVoidElements = [
  'area',
  'base',
  'basefont',
  'bgsound',
  'br',
  'col',
  'command',
  'embed',
  'frame',
  'hr',
  'image',
  'img',
  'input',
  'isindex',
  'keygen',
  'link',
  'menuitem',
  'meta',
  'nextid',
  'param',
  'source',
  'track',
  'wbr'
];

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('hast').Element} Element
 *
 * @typedef {string} TagName
 * @typedef {null|undefined|TagName|TestFunctionAnything|Array.<TagName|TestFunctionAnything>} Test
 */

/**
 * Check if an element passes a test
 *
 * @callback TestFunctionAnything
 * @param {Element} element
 * @param {number} [index]
 * @param {Parent} [parent]
 * @returns {boolean|void}
 */

/**
 * Check if an element passes a certain node test
 *
 * @template {Element} X
 * @callback TestFunctionPredicate
 * @param {X} element
 * @param {number} [index]
 * @param {Parent} [parent]
 * @returns {element is X}
 */

/**
 * Check if a node is an element and passes a certain node test
 *
 * @callback AssertAnything
 * @param {unknown} [node]
 * @param {number} [index]
 * @param {Parent} [parent]
 * @returns {boolean}
 */

/**
 * Check if a node is an element and passes a certain node test
 *
 * @template {Element} Y
 * @callback AssertPredicate
 * @param {unknown} [node]
 * @param {number} [index]
 * @param {Parent} [parent]
 * @returns {node is Y}
 */

// Check if `node` is an `element` and whether it passes the given test.
const isElement =
  /**
   * Check if a node is an element and passes a test.
   * When a `parent` node is known the `index` of node should also be given.
   *
   * @type {(
   *   (<T extends Element>(node: unknown, test: T['tagName']|TestFunctionPredicate<T>|Array.<T['tagName']|TestFunctionPredicate<T>>, index?: number, parent?: Parent, context?: unknown) => node is T) &
   *   ((node?: unknown, test?: Test, index?: number, parent?: Parent, context?: unknown) => boolean)
   * )}
   */
  (
    /**
     * Check if a node passes a test.
     * When a `parent` node is known the `index` of node should also be given.
     *
     * @param {unknown} [node] Node to check
     * @param {Test} [test] When nullish, checks if `node` is a `Node`.
     * When `string`, works like passing `function (node) {return node.type === test}`.
     * When `function` checks if function passed the node is true.
     * When `array`, checks any one of the subtests pass.
     * @param {number} [index] Position of `node` in `parent`
     * @param {Parent} [parent] Parent of `node`
     * @param {unknown} [context] Context object to invoke `test` with
     * @returns {boolean} Whether test passed and `node` is an `Element` (object with `type` set to `element` and `tagName` set to a non-empty string).
     */
    // eslint-disable-next-line max-params
    function (node, test, index, parent, context) {
      var check = convertElement(test);

      if (
        index !== undefined &&
        index !== null &&
        (typeof index !== 'number' ||
          index < 0 ||
          index === Number.POSITIVE_INFINITY)
      ) {
        throw new Error('Expected positive finite index for child node')
      }

      if (
        parent !== undefined &&
        parent !== null &&
        (!parent.type || !parent.children)
      ) {
        throw new Error('Expected parent node')
      }

      // @ts-ignore Looks like a node.
      if (!node || !node.type || typeof node.type !== 'string') {
        return false
      }

      if (
        (parent === undefined || parent === null) !==
        (index === undefined || index === null)
      ) {
        throw new Error('Expected both parent and index')
      }

      return check.call(context, node, index, parent)
    }
  );

const convertElement =
  /**
   * @type {(
   *   (<T extends Element>(test: T['tagName']|TestFunctionPredicate<T>) => AssertPredicate<T>) &
   *   ((test?: Test) => AssertAnything)
   * )}
   */
  (
    /**
     * Generate an assertion from a check.
     * @param {Test} [test]
     * When nullish, checks if `node` is a `Node`.
     * When `string`, works like passing `function (node) {return node.type === test}`.
     * When `function` checks if function passed the node is true.
     * When `object`, checks that all keys in test are in node, and that they have (strictly) equal values.
     * When `array`, checks any one of the subtests pass.
     * @returns {AssertAnything}
     */
    function (test) {
      if (test === undefined || test === null) {
        return element$1
      }

      if (typeof test === 'string') {
        return tagNameFactory(test)
      }

      if (typeof test === 'object') {
        return anyFactory$1(test)
      }

      if (typeof test === 'function') {
        return castFactory$1(test)
      }

      throw new Error('Expected function, string, or array as test')
    }
  );

/**
 * @param {Array.<TagName|TestFunctionAnything>} tests
 * @returns {AssertAnything}
 */
function anyFactory$1(tests) {
  /** @type {Array.<AssertAnything>} */
  var checks = [];
  var index = -1;

  while (++index < tests.length) {
    checks[index] = convertElement(tests[index]);
  }

  return castFactory$1(any)

  /**
   * @this {unknown}
   * @param {unknown[]} parameters
   * @returns {boolean}
   */
  function any(...parameters) {
    var index = -1;

    while (++index < checks.length) {
      if (checks[index].call(this, ...parameters)) {
        return true
      }
    }

    return false
  }
}

/**
 * Utility to convert a string into a function which checks a given node’s tag
 * name for said string.
 *
 * @param {TagName} check
 * @returns {AssertAnything}
 */
function tagNameFactory(check) {
  return tagName

  /**
   * @param {Node} node
   * @returns {boolean}
   */
  function tagName(node) {
    return element$1(node) && node.tagName === check
  }
}

/**
 * @param {TestFunctionAnything} check
 * @returns {AssertAnything}
 */
function castFactory$1(check) {
  return assertion

  /**
   * @this {unknown}
   * @param {Node} node
   * @param {Array.<unknown>} parameters
   * @returns {boolean}
   */
  function assertion(node, ...parameters) {
    return element$1(node) && Boolean(check.call(this, node, ...parameters))
  }
}

/**
 * Utility to return true if this is an element.
 * @param {unknown} node
 * @returns {boolean}
 */
function element$1(node) {
  return Boolean(
    node &&
      typeof node === 'object' &&
      // @ts-ignore Looks like a node.
      node.type === 'element' &&
      // @ts-ignore Looks like an element.
      typeof node.tagName === 'string'
  )
}

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 *
 * @typedef {string} Type
 * @typedef {Object<string, unknown>} Props
 *
 * @typedef {null|undefined|Type|Props|TestFunctionAnything|Array.<Type|Props|TestFunctionAnything>} Test
 */

var convert =
  /**
   * @type {(
   *   (<T extends Node>(test: T['type']|Partial<T>|TestFunctionPredicate<T>) => AssertPredicate<T>) &
   *   ((test?: Test) => AssertAnything)
   * )}
   */
  (
    /**
     * Generate an assertion from a check.
     * @param {Test} [test]
     * When nullish, checks if `node` is a `Node`.
     * When `string`, works like passing `function (node) {return node.type === test}`.
     * When `function` checks if function passed the node is true.
     * When `object`, checks that all keys in test are in node, and that they have (strictly) equal values.
     * When `array`, checks any one of the subtests pass.
     * @returns {AssertAnything}
     */
    function (test) {
      if (test === undefined || test === null) {
        return ok
      }

      if (typeof test === 'string') {
        return typeFactory(test)
      }

      if (typeof test === 'object') {
        // @ts-ignore looks like a list of tests / partial test object.
        return 'length' in test ? anyFactory(test) : propsFactory(test)
      }

      if (typeof test === 'function') {
        return castFactory(test)
      }

      throw new Error('Expected function, string, or object as test')
    }
  );
/**
 * @param {Array.<Type|Props|TestFunctionAnything>} tests
 * @returns {AssertAnything}
 */
function anyFactory(tests) {
  /** @type {Array.<AssertAnything>} */
  var checks = [];
  var index = -1;

  while (++index < tests.length) {
    checks[index] = convert(tests[index]);
  }

  return castFactory(any)

  /**
   * @this {unknown}
   * @param {unknown[]} parameters
   * @returns {boolean}
   */
  function any(...parameters) {
    var index = -1;

    while (++index < checks.length) {
      if (checks[index].call(this, ...parameters)) return true
    }
  }
}

/**
 * Utility to assert each property in `test` is represented in `node`, and each
 * values are strictly equal.
 *
 * @param {Props} check
 * @returns {AssertAnything}
 */
function propsFactory(check) {
  return castFactory(all)

  /**
   * @param {Node} node
   * @returns {boolean}
   */
  function all(node) {
    /** @type {string} */
    var key;

    for (key in check) {
      if (node[key] !== check[key]) return
    }

    return true
  }
}

/**
 * Utility to convert a string into a function which checks a given node’s type
 * for said string.
 *
 * @param {Type} check
 * @returns {AssertAnything}
 */
function typeFactory(check) {
  return castFactory(type)

  /**
   * @param {Node} node
   */
  function type(node) {
    return node && node.type === check
  }
}

/**
 * Utility to convert a string into a function which checks a given node’s type
 * for said string.
 * @param {TestFunctionAnything} check
 * @returns {AssertAnything}
 */
function castFactory(check) {
  return assertion

  /**
   * @this {unknown}
   * @param {Array.<unknown>} parameters
   * @returns {boolean}
   */
  function assertion(...parameters) {
    return Boolean(check.call(this, ...parameters))
  }
}

// Utility to return true.
function ok() {
  return true
}

/**
 * @typedef {import('../../types.js').Comment} Comment
 */

/** @type {import('unist-util-is').AssertPredicate<Comment>} */
// @ts-ignore
const comment$1 = convert('comment');

/**
 * @param {unknown} thing
 * @returns {boolean}
 */
function whitespace(thing) {
  /** @type {string} */
  var value =
    // @ts-ignore looks like a node.
    thing && typeof thing === 'object' && thing.type === 'text'
      ? // @ts-ignore looks like a text.
        thing.value || ''
      : thing;

  // HTML whitespace expression.
  // See <https://html.spec.whatwg.org/#space-character>.
  return typeof value === 'string' && value.replace(/[ \t\n\f\r]/g, '') === ''
}

/**
 * @typedef {import('../../types.js').Parent} Parent
 * @typedef {import('../../types.js').Child} Child
 */

const siblingAfter = siblings(1);
const siblingBefore = siblings(-1);

/**
 * Factory to check siblings in a direction.
 *
 * @param {number} increment
 */
function siblings(increment) {
  return sibling

  /**
   * Find applicable siblings in a direction.
   *
   * @param {Parent} parent
   * @param {number} index
   * @param {boolean} [includeWhitespace=false]
   * @returns {Child}
   */
  function sibling(parent, index, includeWhitespace) {
    var siblings = parent && parent.children;
    var offset = index + increment;
    var next = siblings && siblings[offset];

    if (!includeWhitespace) {
      while (next && whitespace(next)) {
        offset += increment;
        next = siblings[offset];
      }
    }

    return next
  }
}

/**
 * @typedef {import('../../types.js').Node} Node
 * @typedef {import('../../types.js').Text} Text
 */

/** @type {import('unist-util-is').AssertPredicate<Text>} */
// @ts-ignore
var isText = convert('text');

/**
 * Check if `node` starts with whitespace.
 *
 * @param {Node} node
 * @returns {boolean}
 */
function whitespaceStart(node) {
  return isText(node) && whitespace(node.value.charAt(0))
}

/**
 * @typedef {import('../types.js').OmitHandle} OmitHandle
 */

var own$3 = {}.hasOwnProperty;

/**
 * Factory to check if a given node can have a tag omitted.
 *
 * @param {Object.<string, OmitHandle>} handlers
 * @returns {OmitHandle}
 */
function omission$1(handlers) {
  return omit

  /**
   * Check if a given node can have a tag omitted.
   *
   * @type {OmitHandle}
   */
  function omit(node, index, parent) {
    return (
      own$3.call(handlers, node.tagName) &&
      handlers[node.tagName](node, index, parent)
    )
  }
}

/**
 * @typedef {import('../types.js').OmitHandle} OmitHandle
 */

const closing = omission$1({
  html: html$1,
  head: headOrColgroupOrCaption,
  body: body$1,
  p,
  li,
  dt,
  dd,
  rt: rubyElement,
  rp: rubyElement,
  optgroup,
  option,
  menuitem,
  colgroup: headOrColgroupOrCaption,
  caption: headOrColgroupOrCaption,
  thead,
  tbody: tbody$1,
  tfoot,
  tr,
  td: cells,
  th: cells
});

/**
 * Macro for `</head>`, `</colgroup>`, and `</caption>`.
 *
 * @type {OmitHandle}
 */
function headOrColgroupOrCaption(_, index, parent) {
  var next = siblingAfter(parent, index, true);
  return !next || (!comment$1(next) && !whitespaceStart(next))
}

/**
 * Whether to omit `</html>`.
 *
 * @type {OmitHandle}
 */
function html$1(_, index, parent) {
  var next = siblingAfter(parent, index);
  return !next || !comment$1(next)
}

/**
 * Whether to omit `</body>`.
 *
 * @type {OmitHandle}
 */
function body$1(_, index, parent) {
  var next = siblingAfter(parent, index);
  return !next || !comment$1(next)
}

/**
 * Whether to omit `</p>`.
 *
 * @type {OmitHandle}
 */
function p(_, index, parent) {
  var next = siblingAfter(parent, index);
  return next
    ? isElement(next, [
        'address',
        'article',
        'aside',
        'blockquote',
        'details',
        'div',
        'dl',
        'fieldset',
        'figcaption',
        'figure',
        'footer',
        'form',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'header',
        'hgroup',
        'hr',
        'main',
        'menu',
        'nav',
        'ol',
        'p',
        'pre',
        'section',
        'table',
        'ul'
      ])
    : !parent ||
        // Confusing parent.
        !isElement(parent, [
          'a',
          'audio',
          'del',
          'ins',
          'map',
          'noscript',
          'video'
        ])
}

/**
 * Whether to omit `</li>`.
 *
 * @type {OmitHandle}
 */
function li(_, index, parent) {
  var next = siblingAfter(parent, index);
  return !next || isElement(next, 'li')
}

/**
 * Whether to omit `</dt>`.
 *
 * @type {OmitHandle}
 */
function dt(_, index, parent) {
  var next = siblingAfter(parent, index);
  return next && isElement(next, ['dt', 'dd'])
}

/**
 * Whether to omit `</dd>`.
 *
 * @type {OmitHandle}
 */
function dd(_, index, parent) {
  var next = siblingAfter(parent, index);
  return !next || isElement(next, ['dt', 'dd'])
}

/**
 * Whether to omit `</rt>` or `</rp>`.
 *
 * @type {OmitHandle}
 */
function rubyElement(_, index, parent) {
  var next = siblingAfter(parent, index);
  return !next || isElement(next, ['rp', 'rt'])
}

/**
 * Whether to omit `</optgroup>`.
 *
 * @type {OmitHandle}
 */
function optgroup(_, index, parent) {
  var next = siblingAfter(parent, index);
  return !next || isElement(next, 'optgroup')
}

/**
 * Whether to omit `</option>`.
 *
 * @type {OmitHandle}
 */
function option(_, index, parent) {
  var next = siblingAfter(parent, index);
  return !next || isElement(next, ['option', 'optgroup'])
}

/**
 * Whether to omit `</menuitem>`.
 *
 * @type {OmitHandle}
 */
function menuitem(_, index, parent) {
  var next = siblingAfter(parent, index);
  return !next || isElement(next, ['menuitem', 'hr', 'menu'])
}

/**
 * Whether to omit `</thead>`.
 *
 * @type {OmitHandle}
 */
function thead(_, index, parent) {
  var next = siblingAfter(parent, index);
  return next && isElement(next, ['tbody', 'tfoot'])
}

/**
 * Whether to omit `</tbody>`.
 *
 * @type {OmitHandle}
 */
function tbody$1(_, index, parent) {
  var next = siblingAfter(parent, index);
  return !next || isElement(next, ['tbody', 'tfoot'])
}

/**
 * Whether to omit `</tfoot>`.
 *
 * @type {OmitHandle}
 */
function tfoot(_, index, parent) {
  return !siblingAfter(parent, index)
}

/**
 * Whether to omit `</tr>`.
 *
 * @type {OmitHandle}
 */
function tr(_, index, parent) {
  var next = siblingAfter(parent, index);
  return !next || isElement(next, 'tr')
}

/**
 * Whether to omit `</td>` or `</th>`.
 *
 * @type {OmitHandle}
 */
function cells(_, index, parent) {
  var next = siblingAfter(parent, index);
  return !next || isElement(next, ['td', 'th'])
}

/**
 * @typedef {import('../types.js').OmitHandle} OmitHandle
 * @typedef {import('../types.js').Child} Child
 */

const opening = omission$1({
  html,
  head,
  body,
  colgroup,
  tbody
});

/**
 * Whether to omit `<html>`.
 *
 * @type {OmitHandle}
 */
function html(node) {
  var head = siblingAfter(node, -1);
  return !head || !comment$1(head)
}

/**
 * Whether to omit `<head>`.
 *
 * @type {OmitHandle}
 */
function head(node) {
  var children = node.children;
  /** @type {Array.<string>} */
  var seen = [];
  var index = -1;
  /** @type {Child} */
  var child;

  while (++index < children.length) {
    child = children[index];
    if (isElement(child, ['title', 'base'])) {
      if (seen.includes(child.tagName)) return false
      seen.push(child.tagName);
    }
  }

  return children.length > 0
}

/**
 * Whether to omit `<body>`.
 *
 * @type {OmitHandle}
 */
function body(node) {
  var head = siblingAfter(node, -1, true);

  return (
    !head ||
    (!comment$1(head) &&
      !whitespaceStart(head) &&
      !isElement(head, ['meta', 'link', 'script', 'style', 'template']))
  )
}

/**
 * Whether to omit `<colgroup>`.
 * The spec describes some logic for the opening tag, but it’s easier to
 * implement in the closing tag, to the same effect, so we handle it there
 * instead.
 *
 * @type {OmitHandle}
 */
function colgroup(node, index, parent) {
  var previous = siblingBefore(parent, index);
  var head = siblingAfter(node, -1, true);

  // Previous colgroup was already omitted.
  if (
    isElement(previous, 'colgroup') &&
    closing(previous, parent.children.indexOf(previous), parent)
  ) {
    return false
  }

  return head && isElement(head, 'col')
}

/**
 * Whether to omit `<tbody>`.
 *
 * @type {OmitHandle}
 */
function tbody(node, index, parent) {
  var previous = siblingBefore(parent, index);
  var head = siblingAfter(node, -1);

  // Previous table section was already omitted.
  if (
    isElement(previous, ['thead', 'tbody']) &&
    closing(previous, parent.children.indexOf(previous), parent)
  ) {
    return false
  }

  return head && isElement(head, 'tr')
}

/**
 * @typedef {import('../types.js').Omission} Omission
 */

/** @type {Omission} */
const omission = {opening, closing};

/**
 * @typedef {Object} CoreOptions
 * @property {string[]} [subset=[]] Whether to only escape the given subset of characters (`string[]`)
 * @property {boolean} [escapeOnly=false] Whether to only escape possibly dangerous characters (`boolean`, default: `false`). Those characters are `"`, `&`, `'`, `<`, `>`, and `` ` ``
 *
 * @typedef {Object} FormatOptions
 * @property {function (number, number, CoreWithFormatOptions): string} format
 *
 * @typedef {CoreOptions & FormatOptions & import('./util/format-smart.js').FormatSmartOptions} CoreWithFormatOptions
 */

/**
 * Encode special characters in `value`.
 *
 * @param {string} value
 * @param {CoreWithFormatOptions} [options]
 * @returns {string}
 */
function core(value, options) {
  value = value.replace(
    options.subset ? charactersToExpression(options.subset) : /["&'<>`]/g,
    basic
  );

  if (options.subset || options.escapeOnly) {
    return value
  }

  return (
    value
      // Surrogate pairs.
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, surrogate)
      // BMP control characters (C0 except for LF, CR, SP; DEL; and some more
      // non-ASCII ones).
      .replace(
        // eslint-disable-next-line no-control-regex, unicorn/no-hex-escape
        /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g,
        basic
      )
  )

  /**
   * @param {string} pair
   * @param {number} index
   * @param {string} all
   */
  function surrogate(pair, index, all) {
    return options.format(
      (pair.charCodeAt(0) - 0xd800) * 0x400 +
        pair.charCodeAt(1) -
        0xdc00 +
        0x10000,
      all.charCodeAt(index + 2),
      options
    )
  }

  /**
   * @param {string} character
   * @param {number} index
   * @param {string} all
   */
  function basic(character, index, all) {
    return options.format(
      character.charCodeAt(0),
      all.charCodeAt(index + 1),
      options
    )
  }
}

/**
 * @param {string[]} subset
 * @returns {RegExp}
 */
function charactersToExpression(subset) {
  /** @type {string[]} */
  var groups = [];
  var index = -1;

  while (++index < subset.length) {
    groups.push(subset[index].replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'));
  }

  return new RegExp('(?:' + groups.join('|') + ')', 'g')
}

/**
 * Transform `code` into a hexadecimal character reference.
 *
 * @param {number} code
 * @param {number} next
 * @param {boolean} omit
 * @returns {string}
 */
function toHexadecimal(code, next, omit) {
  var value = '&#x' + code.toString(16).toUpperCase();
  return omit && next && !/[\dA-Fa-f]/.test(String.fromCharCode(next))
    ? value
    : value + ';'
}

/**
 * Transform `code` into a decimal character reference.
 *
 * @param {number} code
 * @param {number} next
 * @param {boolean} omit
 * @returns {string}
 */
function toDecimal(code, next, omit) {
  var value = '&#' + String(code);
  return omit && next && !/\d/.test(String.fromCharCode(next))
    ? value
    : value + ';'
}

var characterEntitiesLegacy = {
  AElig: 'Æ',
  AMP: '&',
  Aacute: 'Á',
  Acirc: 'Â',
  Agrave: 'À',
  Aring: 'Å',
  Atilde: 'Ã',
  Auml: 'Ä',
  COPY: '©',
  Ccedil: 'Ç',
  ETH: 'Ð',
  Eacute: 'É',
  Ecirc: 'Ê',
  Egrave: 'È',
  Euml: 'Ë',
  GT: '>',
  Iacute: 'Í',
  Icirc: 'Î',
  Igrave: 'Ì',
  Iuml: 'Ï',
  LT: '<',
  Ntilde: 'Ñ',
  Oacute: 'Ó',
  Ocirc: 'Ô',
  Ograve: 'Ò',
  Oslash: 'Ø',
  Otilde: 'Õ',
  Ouml: 'Ö',
  QUOT: '"',
  REG: '®',
  THORN: 'Þ',
  Uacute: 'Ú',
  Ucirc: 'Û',
  Ugrave: 'Ù',
  Uuml: 'Ü',
  Yacute: 'Ý',
  aacute: 'á',
  acirc: 'â',
  acute: '´',
  aelig: 'æ',
  agrave: 'à',
  amp: '&',
  aring: 'å',
  atilde: 'ã',
  auml: 'ä',
  brvbar: '¦',
  ccedil: 'ç',
  cedil: '¸',
  cent: '¢',
  copy: '©',
  curren: '¤',
  deg: '°',
  divide: '÷',
  eacute: 'é',
  ecirc: 'ê',
  egrave: 'è',
  eth: 'ð',
  euml: 'ë',
  frac12: '½',
  frac14: '¼',
  frac34: '¾',
  gt: '>',
  iacute: 'í',
  icirc: 'î',
  iexcl: '¡',
  igrave: 'ì',
  iquest: '¿',
  iuml: 'ï',
  laquo: '«',
  lt: '<',
  macr: '¯',
  micro: 'µ',
  middot: '·',
  nbsp: ' ',
  not: '¬',
  ntilde: 'ñ',
  oacute: 'ó',
  ocirc: 'ô',
  ograve: 'ò',
  ordf: 'ª',
  ordm: 'º',
  oslash: 'ø',
  otilde: 'õ',
  ouml: 'ö',
  para: '¶',
  plusmn: '±',
  pound: '£',
  quot: '"',
  raquo: '»',
  reg: '®',
  sect: '§',
  shy: '­',
  sup1: '¹',
  sup2: '²',
  sup3: '³',
  szlig: 'ß',
  thorn: 'þ',
  times: '×',
  uacute: 'ú',
  ucirc: 'û',
  ugrave: 'ù',
  uml: '¨',
  uuml: 'ü',
  yacute: 'ý',
  yen: '¥',
  yuml: 'ÿ'
};

var characterEntitiesHtml4 = {
  nbsp: ' ',
  iexcl: '¡',
  cent: '¢',
  pound: '£',
  curren: '¤',
  yen: '¥',
  brvbar: '¦',
  sect: '§',
  uml: '¨',
  copy: '©',
  ordf: 'ª',
  laquo: '«',
  not: '¬',
  shy: '­',
  reg: '®',
  macr: '¯',
  deg: '°',
  plusmn: '±',
  sup2: '²',
  sup3: '³',
  acute: '´',
  micro: 'µ',
  para: '¶',
  middot: '·',
  cedil: '¸',
  sup1: '¹',
  ordm: 'º',
  raquo: '»',
  frac14: '¼',
  frac12: '½',
  frac34: '¾',
  iquest: '¿',
  Agrave: 'À',
  Aacute: 'Á',
  Acirc: 'Â',
  Atilde: 'Ã',
  Auml: 'Ä',
  Aring: 'Å',
  AElig: 'Æ',
  Ccedil: 'Ç',
  Egrave: 'È',
  Eacute: 'É',
  Ecirc: 'Ê',
  Euml: 'Ë',
  Igrave: 'Ì',
  Iacute: 'Í',
  Icirc: 'Î',
  Iuml: 'Ï',
  ETH: 'Ð',
  Ntilde: 'Ñ',
  Ograve: 'Ò',
  Oacute: 'Ó',
  Ocirc: 'Ô',
  Otilde: 'Õ',
  Ouml: 'Ö',
  times: '×',
  Oslash: 'Ø',
  Ugrave: 'Ù',
  Uacute: 'Ú',
  Ucirc: 'Û',
  Uuml: 'Ü',
  Yacute: 'Ý',
  THORN: 'Þ',
  szlig: 'ß',
  agrave: 'à',
  aacute: 'á',
  acirc: 'â',
  atilde: 'ã',
  auml: 'ä',
  aring: 'å',
  aelig: 'æ',
  ccedil: 'ç',
  egrave: 'è',
  eacute: 'é',
  ecirc: 'ê',
  euml: 'ë',
  igrave: 'ì',
  iacute: 'í',
  icirc: 'î',
  iuml: 'ï',
  eth: 'ð',
  ntilde: 'ñ',
  ograve: 'ò',
  oacute: 'ó',
  ocirc: 'ô',
  otilde: 'õ',
  ouml: 'ö',
  divide: '÷',
  oslash: 'ø',
  ugrave: 'ù',
  uacute: 'ú',
  ucirc: 'û',
  uuml: 'ü',
  yacute: 'ý',
  thorn: 'þ',
  yuml: 'ÿ',
  fnof: 'ƒ',
  Alpha: 'Α',
  Beta: 'Β',
  Gamma: 'Γ',
  Delta: 'Δ',
  Epsilon: 'Ε',
  Zeta: 'Ζ',
  Eta: 'Η',
  Theta: 'Θ',
  Iota: 'Ι',
  Kappa: 'Κ',
  Lambda: 'Λ',
  Mu: 'Μ',
  Nu: 'Ν',
  Xi: 'Ξ',
  Omicron: 'Ο',
  Pi: 'Π',
  Rho: 'Ρ',
  Sigma: 'Σ',
  Tau: 'Τ',
  Upsilon: 'Υ',
  Phi: 'Φ',
  Chi: 'Χ',
  Psi: 'Ψ',
  Omega: 'Ω',
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  delta: 'δ',
  epsilon: 'ε',
  zeta: 'ζ',
  eta: 'η',
  theta: 'θ',
  iota: 'ι',
  kappa: 'κ',
  lambda: 'λ',
  mu: 'μ',
  nu: 'ν',
  xi: 'ξ',
  omicron: 'ο',
  pi: 'π',
  rho: 'ρ',
  sigmaf: 'ς',
  sigma: 'σ',
  tau: 'τ',
  upsilon: 'υ',
  phi: 'φ',
  chi: 'χ',
  psi: 'ψ',
  omega: 'ω',
  thetasym: 'ϑ',
  upsih: 'ϒ',
  piv: 'ϖ',
  bull: '•',
  hellip: '…',
  prime: '′',
  Prime: '″',
  oline: '‾',
  frasl: '⁄',
  weierp: '℘',
  image: 'ℑ',
  real: 'ℜ',
  trade: '™',
  alefsym: 'ℵ',
  larr: '←',
  uarr: '↑',
  rarr: '→',
  darr: '↓',
  harr: '↔',
  crarr: '↵',
  lArr: '⇐',
  uArr: '⇑',
  rArr: '⇒',
  dArr: '⇓',
  hArr: '⇔',
  forall: '∀',
  part: '∂',
  exist: '∃',
  empty: '∅',
  nabla: '∇',
  isin: '∈',
  notin: '∉',
  ni: '∋',
  prod: '∏',
  sum: '∑',
  minus: '−',
  lowast: '∗',
  radic: '√',
  prop: '∝',
  infin: '∞',
  ang: '∠',
  and: '∧',
  or: '∨',
  cap: '∩',
  cup: '∪',
  int: '∫',
  there4: '∴',
  sim: '∼',
  cong: '≅',
  asymp: '≈',
  ne: '≠',
  equiv: '≡',
  le: '≤',
  ge: '≥',
  sub: '⊂',
  sup: '⊃',
  nsub: '⊄',
  sube: '⊆',
  supe: '⊇',
  oplus: '⊕',
  otimes: '⊗',
  perp: '⊥',
  sdot: '⋅',
  lceil: '⌈',
  rceil: '⌉',
  lfloor: '⌊',
  rfloor: '⌋',
  lang: '〈',
  rang: '〉',
  loz: '◊',
  spades: '♠',
  clubs: '♣',
  hearts: '♥',
  diams: '♦',
  quot: '"',
  amp: '&',
  lt: '<',
  gt: '>',
  OElig: 'Œ',
  oelig: 'œ',
  Scaron: 'Š',
  scaron: 'š',
  Yuml: 'Ÿ',
  circ: 'ˆ',
  tilde: '˜',
  ensp: ' ',
  emsp: ' ',
  thinsp: ' ',
  zwnj: '‌',
  zwj: '‍',
  lrm: '‎',
  rlm: '‏',
  ndash: '–',
  mdash: '—',
  lsquo: '‘',
  rsquo: '’',
  sbquo: '‚',
  ldquo: '“',
  rdquo: '”',
  bdquo: '„',
  dagger: '†',
  Dagger: '‡',
  permil: '‰',
  lsaquo: '‹',
  rsaquo: '›',
  euro: '€'
};

/** @type {Object.<string, string>} */
var characters = {};

var own$2 = {}.hasOwnProperty;
/** @type {string} */
var key;

for (key in characterEntitiesHtml4) {
  if (own$2.call(characterEntitiesHtml4, key)) {
    characters[characterEntitiesHtml4[key]] = key;
  }
}

var dangerous = [
  'cent',
  'copy',
  'divide',
  'gt',
  'lt',
  'not',
  'para',
  'times'
];

var own$1 = {}.hasOwnProperty;

/**
 * Transform `code` into a named character reference.
 *
 * @param {number} code
 * @param {number} next
 * @param {boolean} omit
 * @param {boolean} attribute
 * @returns {string}
 */
function toNamed(code, next, omit, attribute) {
  var character = String.fromCharCode(code);
  /** @type {string} */
  var name;
  /** @type {string} */
  var value;

  if (own$1.call(characters, character)) {
    name = characters[character];
    value = '&' + name;

    if (
      omit &&
      own$1.call(characterEntitiesLegacy, name) &&
      !dangerous.includes(name) &&
      (!attribute ||
        (next &&
          next !== 61 /* `=` */ &&
          /[^\da-z]/i.test(String.fromCharCode(next))))
    ) {
      return value
    }

    return value + ';'
  }

  return ''
}

/**
 * @typedef {Object} FormatSmartOptions
 * @property {boolean} [useNamedReferences=false] Prefer named character references (`&amp;`) where possible (`boolean?`, default: `false`)
 * @property {boolean} [useShortestReferences=false] Prefer the shortest possible reference, if that results in less bytes (`boolean?`, default: `false`). **Note**: `useNamedReferences` can be omitted when using `useShortestReferences`
 * @property {boolean} [omitOptionalSemicolons=false] Whether to omit semicolons when possible (`boolean?`, default: `false`). **Note**: This creates what HTML calls “parse errors” but is otherwise still valid HTML — don’t use this except when building a minifier. Omitting semicolons is possible for legacy named references in certain cases, and numeric references in some cases
 * @property {boolean} [attribute=false] Only needed when operating dangerously with `omitOptionalSemicolons: true`. Create character references which don’t fail in attributes (`boolean?`, default: `false`).
 */

/**
 * Encode `character` according to `options`.
 *
 * @param {number} code
 * @param {number} next
 * @param {FormatSmartOptions} options
 * @returns {string}
 */
function formatSmart(code, next, options) {
  /** @type {string} */
  var named;
  /** @type {string} */
  var numeric;
  /** @type {string} */
  var decimal;

  if (options.useNamedReferences || options.useShortestReferences) {
    named = toNamed(
      code,
      next,
      options.omitOptionalSemicolons,
      options.attribute
    );
  }

  if (options.useShortestReferences || !named) {
    numeric = toHexadecimal(code, next, options.omitOptionalSemicolons);

    // Use the shortest numeric reference when requested.
    // A simple algorithm would use decimal for all code points under 100, as
    // those are shorter than hexadecimal:
    //
    // * `&#99;` vs `&#x63;` (decimal shorter)
    // * `&#100;` vs `&#x64;` (equal)
    //
    // However, because we take `next` into consideration when `omit` is used,
    // And it would be possible that decimals are shorter on bigger values as
    // well if `next` is hexadecimal but not decimal, we instead compare both.
    if (options.useShortestReferences) {
      decimal = toDecimal(code, next, options.omitOptionalSemicolons);

      if (decimal.length < numeric.length) {
        numeric = decimal;
      }
    }
  }

  return named &&
    (!options.useShortestReferences || named.length < numeric.length)
    ? named
    : numeric
}

/**
 * @typedef {import('./core.js').CoreOptions & import('./util/format-smart.js').FormatSmartOptions} StringifyEntitiesOptions
 * @typedef {import('./core.js').CoreOptions} StringifyEntitiesLightOptions
 */

/**
 * Encode special characters in `value`.
 * @param {string} value
 * @param {StringifyEntitiesOptions} [options]
 */
function stringifyEntities(value, options) {
  return core(value, Object.assign({format: formatSmart}, options))
}

/**
 * @typedef {import('./types.js').Handle} Handle
 * @typedef {import('./types.js').Comment} Comment
 */

/**
 * @type {Handle}
 * @param {Comment} node
 */
function comment(ctx, node) {
  // See: <https://html.spec.whatwg.org/multipage/syntax.html#comments>
  return ctx.bogusComments
    ? '<?' +
        stringifyEntities(
          node.value,
          Object.assign({}, ctx.entities, {subset: ['>']})
        ) +
        '>'
    : '<!--' + node.value.replace(/^>|^->|<!--|-->|--!>|<!-$/g, encode) + '-->'

  /**
   * @param {string} $0
   */
  function encode($0) {
    return stringifyEntities(
      $0,
      Object.assign({}, ctx.entities, {subset: ['<', '>']})
    )
  }
}

/**
 * @typedef {import('./types.js').Handle} Handle
 */

/**
 * @type {Handle}
 */
function doctype(ctx) {
  return (
    '<!' +
    (ctx.upperDoctype ? 'DOCTYPE' : 'doctype') +
    (ctx.tightDoctype ? '' : ' ') +
    'html>'
  )
}

/**
 * Parse space separated tokens to an array of strings.
 *
 * @param {string} value Space separated tokens
 * @returns {Array.<string>} Tokens
 */

/**
 * Serialize an array of strings as space separated tokens.
 *
 * @param {Array.<string|number>} values Tokens
 * @returns {string} Space separated tokens
 */
function stringify$1(values) {
  return values.join(' ').trim()
}

/**
 * @typedef {Object} StringifyOptions
 * @property {boolean} [padLeft=true] Whether to pad a space before a token (`boolean`, default: `true`).
 * @property {boolean} [padRight=false] Whether to pad a space after a token (`boolean`, default: `false`).
 */

/**
 * Serialize an array of strings to comma separated tokens.
 *
 * @param {Array.<string|number>} values
 * @param {StringifyOptions} [options]
 * @returns {string}
 */
function stringify(values, options) {
  var settings = options || {};

  // Ensure the last empty entry is seen.
  if (values[values.length - 1] === '') {
    values = values.concat('');
  }

  return values
    .join(
      (settings.padRight ? ' ' : '') +
        ',' +
        (settings.padLeft === false ? '' : ' ')
    )
    .trim()
}

/**
 * Get the total count of `character` in `value`.
 *
 * @param {any} value Content, coerced to string
 * @param {string} character Single character to look for
 * @return {number} Number of times `character` occurred in `value`.
 */
function ccount(value, character) {
  var source = String(value);
  var count = 0;
  var index;

  if (typeof character !== 'string') {
    throw new Error('Expected character')
  }

  index = source.indexOf(character);

  while (index !== -1) {
    count++;
    index = source.indexOf(character, index + character.length);
  }

  return count
}

/**
 * @typedef {import('./types.js').Handle} Handle
 * @typedef {import('./types.js').Parent} Parent
 */

/**
 * Serialize all children of `parent`.
 *
 * @type {Handle}
 * @param {Parent} parent
 */
function all(ctx, parent) {
  /** @type {Array.<string>} */
  var results = [];
  var children = (parent && parent.children) || [];
  var index = -1;

  while (++index < children.length) {
    results[index] = one(ctx, children[index], index, parent);
  }

  return results.join('')
}

// Maps of subsets.
// Each value is a matrix of tuples.
// The first value causes parse errors, the second is valid.
// Of both values, the first value is unsafe, and the second is safe.
const constants = {
  // See: <https://html.spec.whatwg.org/#attribute-name-state>.
  name: [
    ['\t\n\f\r &/=>'.split(''), '\t\n\f\r "&\'/=>`'.split('')],
    ['\0\t\n\f\r "&\'/<=>'.split(''), '\0\t\n\f\r "&\'/<=>`'.split('')]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(unquoted)-state>.
  unquoted: [
    ['\t\n\f\r &>'.split(''), '\0\t\n\f\r "&\'<=>`'.split('')],
    ['\0\t\n\f\r "&\'<=>`'.split(''), '\0\t\n\f\r "&\'<=>`'.split('')]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(single-quoted)-state>.
  single: [
    ["&'".split(''), '"&\'`'.split('')],
    ["\0&'".split(''), '\0"&\'`'.split('')]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(double-quoted)-state>.
  double: [
    ['"&'.split(''), '"&\'`'.split('')],
    ['\0"&'.split(''), '\0"&\'`'.split('')]
  ]
};

/**
 * @typedef {import('./types.js').Handle} Handle
 * @typedef {import('./types.js').Element} Element
 * @typedef {import('./types.js').Context} Context
 * @typedef {import('./types.js').Properties} Properties
 * @typedef {import('./types.js').PropertyValue} PropertyValue
 */

/**
 * @type {Handle}
 * @param {Element} node
 */
// eslint-disable-next-line complexity
function element(ctx, node, index, parent) {
  var schema = ctx.schema;
  var omit = schema.space === 'svg' ? undefined : ctx.omit;
  var selfClosing =
    schema.space === 'svg'
      ? ctx.closeEmpty
      : ctx.voids.includes(node.tagName.toLowerCase());
  /** @type {Array.<string>} */
  var parts = [];
  /** @type {string} */
  var attrs;
  /** @type {string} */
  var content;
  /** @type {string} */
  var last;

  if (schema.space === 'html' && node.tagName === 'svg') {
    ctx.schema = svg;
  }

  attrs = serializeAttributes(ctx, node.properties);

  content = all(
    ctx,
    schema.space === 'html' && node.tagName === 'template' ? node.content : node
  );

  ctx.schema = schema;

  // If the node is categorised as void, but it has children, remove the
  // categorisation.
  // This enables for example `menuitem`s, which are void in W3C HTML but not
  // void in WHATWG HTML, to be stringified properly.
  if (content) selfClosing = false;

  if (attrs || !omit || !omit.opening(node, index, parent)) {
    parts.push('<', node.tagName, attrs ? ' ' + attrs : '');

    if (selfClosing && (schema.space === 'svg' || ctx.close)) {
      last = attrs.charAt(attrs.length - 1);
      if (
        !ctx.tightClose ||
        last === '/' ||
        (schema.space === 'svg' && last && last !== '"' && last !== "'")
      ) {
        parts.push(' ');
      }

      parts.push('/');
    }

    parts.push('>');
  }

  parts.push(content);

  if (!selfClosing && (!omit || !omit.closing(node, index, parent))) {
    parts.push('</' + node.tagName + '>');
  }

  return parts.join('')
}

/**
 * @param {Context} ctx
 * @param {Properties} props
 * @returns {string}
 */
function serializeAttributes(ctx, props) {
  /** @type {Array.<string>} */
  var values = [];
  var index = -1;
  /** @type {string} */
  var key;
  /** @type {string} */
  var value;
  /** @type {string} */
  var last;

  for (key in props) {
    if (props[key] !== undefined && props[key] !== null) {
      value = serializeAttribute(ctx, key, props[key]);
      if (value) values.push(value);
    }
  }

  while (++index < values.length) {
    last = ctx.tight ? values[index].charAt(values[index].length - 1) : null;

    // In tight mode, don’t add a space after quoted attributes.
    if (index !== values.length - 1 && last !== '"' && last !== "'") {
      values[index] += ' ';
    }
  }

  return values.join('')
}

/**
 * @param {Context} ctx
 * @param {string} key
 * @param {PropertyValue} value
 * @returns {string}
 */
// eslint-disable-next-line complexity
function serializeAttribute(ctx, key, value) {
  var info = find(ctx.schema, key);
  var quote = ctx.quote;
  /** @type {string} */
  var result;
  /** @type {string} */
  var name;

  if (info.overloadedBoolean && (value === info.attribute || value === '')) {
    value = true;
  } else if (
    info.boolean ||
    (info.overloadedBoolean && typeof value !== 'string')
  ) {
    value = Boolean(value);
  }

  if (
    value === undefined ||
    value === null ||
    value === false ||
    (typeof value === 'number' && Number.isNaN(value))
  ) {
    return ''
  }

  name = stringifyEntities(
    info.attribute,
    Object.assign({}, ctx.entities, {
      // Always encode without parse errors in non-HTML.
      subset:
        constants.name[ctx.schema.space === 'html' ? ctx.valid : 1][ctx.safe]
    })
  );

  // No value.
  // There is currently only one boolean property in SVG: `[download]` on
  // `<a>`.
  // This property does not seem to work in browsers (FF, Sa, Ch), so I can’t
  // test if dropping the value works.
  // But I assume that it should:
  //
  // ```html
  // <!doctype html>
  // <svg viewBox="0 0 100 100">
  //   <a href=https://example.com download>
  //     <circle cx=50 cy=40 r=35 />
  //   </a>
  // </svg>
  // ```
  //
  // See: <https://github.com/wooorm/property-information/blob/main/lib/svg.js>
  if (value === true) return name

  value =
    typeof value === 'object' && 'length' in value
      ? // `spaces` doesn’t accept a second argument, but it’s given here just to
        // keep the code cleaner.
        (info.commaSeparated ? stringify : stringify$1)(value, {
          padLeft: !ctx.tightLists
        })
      : String(value);

  if (ctx.collapseEmpty && !value) return name

  // Check unquoted value.
  if (ctx.unquoted) {
    result = stringifyEntities(
      value,
      Object.assign({}, ctx.entities, {
        subset: constants.unquoted[ctx.valid][ctx.safe],
        attribute: true
      })
    );
  }

  // If we don’t want unquoted, or if `value` contains character references when
  // unquoted…
  if (result !== value) {
    // If the alternative is less common than `quote`, switch.
    if (ctx.smart && ccount(value, quote) > ccount(value, ctx.alternative)) {
      quote = ctx.alternative;
    }

    result =
      quote +
      stringifyEntities(
        value,
        Object.assign({}, ctx.entities, {
          // Always encode without parse errors in non-HTML.
          subset: (quote === "'" ? constants.single : constants.double)[
            ctx.schema.space === 'html' ? ctx.valid : 1
          ][ctx.safe],
          attribute: true
        })
      ) +
      quote;
  }

  // Don’t add a `=` for unquoted empties.
  return name + (result ? '=' + result : result)
}

/**
 * @typedef {import('./types.js').Handle} Handle
 * @typedef {import('./types.js').Text} Text
 */

/**
 * @type {Handle}
 * @param {Text} node
 */
function text(ctx, node, _, parent) {
  // Check if content of `node` should be escaped.
  return parent && (parent.tagName === 'script' || parent.tagName === 'style')
    ? node.value
    : stringifyEntities(
        node.value,
        Object.assign({}, ctx.entities, {subset: ['<', '&']})
      )
}

/**
 * @typedef {import('./types.js').Handle} Handle
 * @typedef {import('./types.js').Raw} Raw
 */

/**
 * @type {Handle}
 * @param {Raw} node
 */
function raw(ctx, node, index, parent) {
  // @ts-ignore Hush.
  return ctx.dangerous ? node.value : text(ctx, node, index, parent)
}

/**
 * @typedef {import('./types.js').Handle} Handle
 */

/**
 * @type {Object.<string, Handle>}
 */
var handlers = {
  comment,
  doctype,
  element,
  // @ts-ignore `raw` is nonstandard
  raw,
  // @ts-ignore `root` is a parent.
  root: all,
  text
};

var own = {}.hasOwnProperty;

/**
 * @type {Handle}
 */
function one(ctx, node, index, parent) {
  if (!node || !node.type) {
    throw new Error('Expected node, not `' + node + '`')
  }

  if (!own.call(handlers, node.type)) {
    throw new Error('Cannot compile unknown node `' + node.type + '`')
  }

  return handlers[node.type](ctx, node, index, parent)
}

/**
 * @typedef {import('./types.js').Node} Node
 * @typedef {import('./types.js').Options} Options
 * @typedef {import('./types.js').Context} Context
 * @typedef {import('./types.js').Quote} Quote
 */

/**
 * @param {Node|Array.<Node>} node
 * @param {Options} [options]
 * @returns {string}
 */
function toHtml(node, options = {}) {
  var quote = options.quote || '"';
  /** @type {Quote} */
  var alternative = quote === '"' ? "'" : '"';

  if (quote !== '"' && quote !== "'") {
    throw new Error('Invalid quote `' + quote + '`, expected `\'` or `"`')
  }

  /** @type {Context} */
  var context = {
    valid: options.allowParseErrors ? 0 : 1,
    safe: options.allowDangerousCharacters ? 0 : 1,
    schema: options.space === 'svg' ? svg : html$2,
    omit: options.omitOptionalTags ? omission : undefined,
    quote,
    alternative,
    smart: options.quoteSmart,
    unquoted: options.preferUnquoted,
    tight: options.tightAttributes,
    upperDoctype: options.upperDoctype,
    tightDoctype: options.tightDoctype,
    bogusComments: options.bogusComments,
    tightLists: options.tightCommaSeparatedLists,
    tightClose: options.tightSelfClosing,
    collapseEmpty: options.collapseEmptyAttributes,
    dangerous: options.allowDangerousHtml,
    voids: options.voids || htmlVoidElements.concat(),
    entities: options.entities || {},
    close: options.closeSelfClosing,
    closeEmpty: options.closeEmptyElements
  };

  return one(
    context,
    // @ts-ignore Assume `node` does not contain a root.
    Array.isArray(node) ? {type: 'root', children: node} : node,
    null,
    null
  )
}

// modified headingRange that only looks for next heading of the same depth
// (instead of same or greater)
// https://github.com/syntax-tree/mdast-util-heading-range
const headingRange = (node, options, handler) => {
  let test = options;
  let children = node.children || [];
  let index = -1;
  let ignoreFinalDefinitions;
  let depth;
  let start;
  let end;
  let nodes;
  let result;
  let child;

  // Object, not regex.
  if (test && typeof test === "object" && !("exec" in test)) {
    ignoreFinalDefinitions = test.ignoreFinalDefinitions;
    test = test.test;
  }

  if (typeof test !== "function") {
    throw new TypeError(
      "Expected `string`, `regexp`, or `function` for `test`, not `" +
        test +
        "`"
    );
  }

  // Find the range.
  while (++index < children.length) {
    child = children[index];

    if (child.type === "heading") {
      if (depth && child.depth === depth) {
        end = index;
        break;
      }

      // @ts-ignore looks like a heading.
      if (!depth && test(toString(child), child)) {
        // @ts-ignore looks like a heading.
        depth = child.depth;
        start = index;
        // Assume no end heading is found.
        end = children.length;
      }
    }
  }

  // When we have a starting heading.
  if (depth) {
    if (ignoreFinalDefinitions) {
      while (
        children[end - 1].type === "definition" ||
        children[end - 1].type === "footnoteDefinition"
      ) {
        end--;
      }
    }

    nodes = handler(
      // @ts-ignore `start` points to a heading.
      children[start],
      children.slice(start + 1, end),
      children[end],
      {
        parent: node,
        start,
        end: children[end] ? end : null,
      }
    );

    if (nodes) {
      // Ensure no empty nodes are inserted.
      // This could be the case if `end` is in `nodes` but no `end` node exists.
      result = [];
      index = -1;

      while (++index < nodes.length) {
        if (nodes[index]) result.push(nodes[index]);
      }

      children.splice(start, end - start + 1, ...result);
    }
  }
};

const coerceToHtml = (nodeArray) => {
  return nodeArray.map((node) => toHtml(toHast(node))).join("") || "";
};

const isCite = (n) => n.type === "textDirective" && n.name === "cite";
const isNewThought = (n) => n.type === "textDirective" && n.name === "nt";

const wrapSections = () => (tree) => {
  visit(tree, "heading", () => {
    headingRange(
      tree,
      (_, node) => {
        return node.depth === 2;
      },
      (start, nodes, end) => {
        return [
          {
            // This is kind of a hacky way to coerce a section element.
            // TODO: consider replacing this with type:html nodes.
            type: "paragraph",
            tagName: "section",
            children: [removePosition(start), ...nodes],
            data: { hName: "section" },
          },
          end,
        ];
      }
    );
  });
};

const blockquoteAttribution = () => (tree) => {
  visit(tree, isCite, (n, i, p) => {
    p.children.splice(i, 1, {
      type: "paragraph",
      children: [
        { type: "html", value: "<footer>" },
        n,
        { type: "html", value: "</footer>" },
      ],
    });
    return SKIP;
  });
};

// TODO: make this a smarter citer (consider bibliography generation?)
const cite = () => (tree) => {
  const getKey = (attr) => {
    const keys = Object.keys(attr);
    if (attr["key"]) {
      return attr["key"];
    } else if (keys.length === 1) {
      return keys[0];
    } else {
      throw `Expected exactly one cite key; received ${keys.length}.`;
    }
  };
  const getRef = (key) => {
    let value;
    visit(
      tree,
      (n) => n.type === "definition" && n.identifier === key,
      (n) => (value = n.url)
    );
    if (!value) throw "No citation for cite key.";
    return value;
  };
  visit(tree, isCite, (n) => {
    const key = getKey(n.attributes);
    n.type = "link";
    n.url = getRef(key);
  });
};

// This shortcut notation inspired by
// https://css-tricks.com/how-to-modify-nodes-in-an-abstract-syntax-tree/
// TODO: generate labels
const imageToFigure = () => (tree) => {
  visit(
    tree,
    (n) => n.type === "paragraph" && n.children.some((c) => c.type === "image"),
    (n, _, p) => {
      if (!(p.type === "paragraph" || p.type === "root")) {
        return;
      }
      const img = unistUtilFind(n, (c) => c.type === "image");
      const captionValue = coerceToHtml(findAllAfter(n, img));
      const caption = captionValue
        ? {
            type: "html",
            value: `<label for="hi" class="margin-toggle">&#8853;</label>
            <input type="checkbox" id="hi" class="margin-toggle"/>
            <span class="marginnote">
              ${captionValue}
            </span>`,
          }
        : null;

      if (caption) {
        n.children = [
          { type: "html", value: "<figure>" },
          img,
          caption,
          { type: "html", value: "</figure>" },
        ];
      } else {
        n.children = [
          { type: "html", value: "<figure>" },
          img,
          { type: "html", value: "</figure>" },
        ];
      }
    }
  );
};

// This is mostly ripped from
// https://github.com/luhmann/tufte-markdown/blob/master/packages/remark-sidenotes/src/remark-sidenotes-transformer.js
const sidenote = () => (tree) => {
  const MARGINNOTE_SYMBOL = "{-}";
  const getReplacement = ({ isMarginNote, noteHTML }, identifier) => {
    const labelCls = `margin-toggle ${isMarginNote ? "" : "sidenote-number"}`;
    const labelSymbol = isMarginNote ? "&oplus;" : "";
    const noteTypeCls = isMarginNote ? "marginnote" : "sidenote";

    return [
      {
        type: "html",
        value: `<label for="${identifier}" class="${labelCls}">${labelSymbol}</label>`,
      },
      {
        type: "html",
        value: `<input type="checkbox" id="${identifier}" class="margin-toggle" />`,
      },
      {
        type: "html",
        value: `<span class="${noteTypeCls}">${noteHTML}</span>`,
      },
    ];
  };
  const extractNoteFromHtml = (note) => {
    const matches = note.match(/(\s+)*({-})*\s*((.|\n)+)/);
    return {
      isMarginNote: matches[2] === MARGINNOTE_SYMBOL,
      noteHTML: matches[3],
    };
  };
  const getByIdentifier = (identifier) => {
    let match;
    visit(
      tree,
      (n) => n.type === "footnoteDefinition" && n.identifier === identifier,
      (n) => (match = n)
    );
    if (!match) {
      throw `No matching definition for identifier ${identifier}`;
    }
    return match;
  };
  visit(tree, "footnoteReference", (n, i, p) => {
    const def = getByIdentifier(n.identifier);
    const notesAst =
      def.children.length && def.children[0].type === "paragraph"
        ? def.children[0].children
        : def.children;
    const text = extractNoteFromHtml(coerceToHtml(notesAst));
    p.children.splice(i, 1, ...getReplacement(text, n.identifier));
  });

  visit(tree, "footnoteDefinition", (_, index, parent) => {
    parent.children.splice(index, 1);
  });
  visit(tree, "footnote", (node, index, parent) => {
    const notesAst = node.children;
    const nodeDetail = extractNoteFromHtml(coerceToHtml(notesAst));

    parent.children.splice(index, 1, ...getReplacement(nodeDetail));
  });
};

const newThought = () => (tree) => {
  visit(tree, isNewThought, (n) => {
    const val = coerceToHtml(n.children);
    n.type = "html";
    n.value = `<span class="newthought">${val}</span>`;
  });
};

const isSans = (node) => {
  return node.type === "containerDirective" && node.name === "sans";
};

const sans = () => (tree) => {
  visit(tree, isSans, (n) => {
    n.type = "html";
    const nodes =
      n.children[0].type === "paragraph" ? n.children[0].children : n.children;
    n.value = `<p class='sans'>${coerceToHtml(nodes)}</p>`;
  });
};

const isFigure = (node) => {
  return node.type === "containerDirective" && node.name === "figure";
};
const figure = () => (tree) => {
  visit(tree, isFigure, (n) => {
    console.log(n);
    const fullwidth = Object.keys(n.attributes).includes("fullwidth");
    const nodes =
      n.children[0].type === "paragraph" ? n.children[0].children : n.children;
    n.type = "paragraph";
    n.children = [
      {
        type: "html",
        value: `<figure${fullwidth ? " class='fullwidth'" : ""}>`,
      },
      ...nodes,
      { type: "html", value: "</figure>" },
    ];
  });
};

export { blockquoteAttribution, cite, figure, imageToFigure, newThought, sans, sidenote, wrapSections };
