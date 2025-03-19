"use strict";

var _excluded = ["session", "applicationId", "params", "timeout"];
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var getController = require('../controllers/rest');
var ENDPOINT = '/collections/';

// Object has reserved keyword so we used Document instead
var Document = /*#__PURE__*/function () {
  function Document() {
    _classCallCheck(this, Document);
    this.rest = getController();
  }
  return _createClass(Document, [{
    key: "create",
    value: function create(collection, document) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var path = ENDPOINT + collection;
      var _options = {
        body: document,
        timeout: options.timeout,
        session: options.session,
        masterKey: options.masterKey
      };
      return this.rest.request('POST', path, _options);
    }
  }, {
    key: "get",
    value: function get(collection, id) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var path = ENDPOINT + collection + '/' + id;
      var _options2 = options,
        session = _options2.session,
        applicationId = _options2.applicationId,
        params = _options2.params,
        timeout = _options2.timeout,
        res = _objectWithoutProperties(_options2, _excluded);
      options = {
        params: _objectSpread(_objectSpread({}, res), params),
        timeout: timeout,
        session: session,
        applicationId: applicationId,
        masterKey: options.masterKey
      };
      return this.rest.request('GET', path, options);
    }
  }, {
    key: "find",
    value: function find(collection, query) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var path = ENDPOINT + collection;
      var _options = {
        body: query,
        timeout: options.timeout,
        session: options.session,
        masterKey: options.masterKey,
        onData: options.onData
      };
      return this.rest.request('GET', path, _options);
    }
  }, {
    key: "update",
    value: function update(collection, document) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var path = ENDPOINT + collection + '/' + document.id;
      var _options = {
        body: document,
        params: options.params,
        timeout: options.timeout,
        session: options.session,
        masterKey: options.masterKey
      };
      return this.rest.request('PUT', path, _options);
    }
  }, {
    key: "delete",
    value: function _delete(collection, object) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var id = object.id || object;
      var path = ENDPOINT + collection + '/' + id;
      var _options = {
        timeout: options.timeout,
        session: options.session,
        masterKey: options.masterKey
      };
      return this.rest.request('DELETE', path, _options);
    }
  }, {
    key: "aggregate",
    value: function aggregate(collection, pipeline) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var path = '/aggregate/' + collection;
      var _options = {
        body: {
          pipeline: pipeline
        },
        timeout: options.timeout,
        session: options.session,
        masterKey: options.masterKey
      };
      return this.rest.request('GET', path, _options);
    }
  }, {
    key: "count",
    value: function count(collection, query) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var path = '/count/' + collection;
      var _options = {
        body: query,
        timeout: options.timeout,
        session: options.session,
        masterKey: options.masterKey
      };
      return this.rest.request('GET', path, _options);
    }
  }, {
    key: "distinct",
    value: function distinct(collection, field, query, options) {
      var path = '/distinct/' + collection;
      var _options = {
        timeout: options.timeout,
        session: options.session,
        masterKey: options.masterKey
      };
      return this.rest.request('GET', path, _options);
    }
  }, {
    key: "abort",
    value: function abort() {
      this.rest.abort();
    }
  }]);
}();
module.exports = Document;