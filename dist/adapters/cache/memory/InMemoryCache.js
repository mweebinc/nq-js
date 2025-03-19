"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var DEFAULT_CACHE_TTL = 5 * 1000;
var InMemoryCache = /*#__PURE__*/function () {
  function InMemoryCache() {
    var ttl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_CACHE_TTL;
    _classCallCheck(this, InMemoryCache);
    this.ttl = ttl;
    this.cache = Object.create(null);
  }
  return _createClass(InMemoryCache, [{
    key: "put",
    value: function put(key, value) {
      var _this = this;
      var ttl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.ttl;
      if (ttl < 0 || isNaN(ttl)) {
        ttl = NaN;
      }
      var record = {
        value: value,
        expire: Date.now() + ttl
      };
      if (!isNaN(record.expire)) {
        record.timeout = setTimeout(function () {
          _this["delete"](key);
        }, ttl);
      }
      this.cache[key] = record;
    }
  }, {
    key: "get",
    value: function get(key) {
      var record = this.cache[key];
      if (record == null) {
        return null;
      }
      // Has Record and isn't expired
      if (isNaN(record.expire) || record.expire >= Date.now()) {
        return record.value;
      }
      // Record has expired
      delete this.cache[key];
      return null;
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      var record = this.cache[key];
      if (record == null) {
        return;
      }
      if (record.timeout) {
        clearTimeout(record.timeout);
      }
      delete this.cache[key];
    }
  }, {
    key: "clear",
    value: function clear() {
      this.cache = Object.create(null);
    }
  }]);
}();
module.exports = InMemoryCache;