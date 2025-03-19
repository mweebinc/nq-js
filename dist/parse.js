"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * Given a source object and a string path, get the value from the source object.
 * If the path is not found, return undefined.
 * @param {Object} source - The source object.
 * @param {string} pathStr - The string path (e.g., "object.key.subKey").
 * @returns {*} - The value found at the given path or undefined if path is not found.
 */
function getValueFromPath(source, pathStr) {
  var path = pathStr.split('.');
  var current = source;
  var _iterator = _createForOfIteratorHelper(path),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var p = _step.value;
      if (current[p] === undefined) {
        return undefined;
      }
      current = current[p];
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return current;
}

/**
 * Extracts all matches from a template string based on a regex pattern.
 * @param {string} template - The template string.
 * @param {RegExp} regex - The regular expression to match.
 * @returns {Array} - An array of matches.
 */
function extractMatches(template, regex) {
  var matches = [];
  var match;
  while ((match = regex.exec(template)) !== null) {
    matches.push(match);
  }
  return matches;
}

/**
 * Replaces all placeholders in a template string with their corresponding values from a source object.
 * @param {string} template - The template string.
 * @param {Object} source - The source object.
 * @returns {string|*} - The string with all placeholders replaced.
 */
function replace(template, source) {
  var regex = /\${(.*?)\}/g;
  var matches = extractMatches(template, regex);

  // Check if there is only one match and it encompasses the entire string
  if (matches.length === 1 && matches[0][0] === template) {
    var value = getValueFromPath(source, matches[0][1]);
    if (Array.isArray(value)) {
      return value; // Return the array directly
    }
    if (value === undefined) {
      return '';
    }
    return value;
  }
  // General case for multiple matches
  var result = template;
  var _iterator2 = _createForOfIteratorHelper(matches),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var match = _step2.value;
      var _value = getValueFromPath(source, match[1]);
      result = result.replace(match[0], _value !== undefined ? _value : '');
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return result;
}
/**
 * Parses a value (can be an array, object, or string) and replaces all placeholders with their corresponding values from a source object.
 * @param {*} value - The template to parse.
 * @param {Object} source - The source object.
 * @returns {*} - The parsed value.
 */
function parse(value, source) {
  // Handle arrays
  if (Array.isArray(value)) {
    return value.reduce(function (acc, cur) {
      var item = parse(cur, source);
      if (item) {
        acc.push(parse(cur, source));
      }
      return acc;
    }, []);
  }
  // Handle objects
  if (_typeof(value) === 'object' && value !== null) {
    return Object.keys(value).reduce(function (acc, key) {
      acc[key] = parse(value[key], source);
      return acc;
    }, {});
  }
  // Handle strings
  if (typeof value === 'string') {
    var _replace;
    // Use the replaced value if it's not null or undefined; otherwise, use the original value
    var item = (_replace = replace(value, source)) !== null && _replace !== void 0 ? _replace : value;
    var whitespaceRegex = /^\s*$/;
    if (typeof item === "string" && item.match(whitespaceRegex)) {
      return '';
    }
    return item;
  }
  // Return the value as is if it's not an array, object, or string
  return value;
}
module.exports = parse;