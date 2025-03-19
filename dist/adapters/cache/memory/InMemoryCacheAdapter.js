"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var InMemoryCache = require('./InMemoryCache');
var InMemoryCacheAdapter = /*#__PURE__*/function () {
  function InMemoryCacheAdapter(ttl) {
    _classCallCheck(this, InMemoryCacheAdapter);
    this.cache = new InMemoryCache(ttl);
  }
  return _createClass(InMemoryCacheAdapter, [{
    key: "get",
    value: function get(key) {
      var record = this.cache.get(key);
      return Promise.resolve(record);
    }
  }, {
    key: "put",
    value: function put(key, value, ttl) {
      this.cache.put(key, value, ttl);
      return Promise.resolve();
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      this.cache["delete"](key);
      return Promise.resolve();
    }
  }, {
    key: "clear",
    value: function clear() {
      this.cache.clear();
      return Promise.resolve();
    }
  }]);
}();
module.exports = InMemoryCacheAdapter;