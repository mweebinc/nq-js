"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var getRestController = require('../controllers/rest');
var User = /*#__PURE__*/function () {
  function User() {
    _classCallCheck(this, User);
    this.rest = getRestController();
  }
  return _createClass(User, [{
    key: "signUp",
    value: function signUp(user) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _options = {
        body: user,
        timeout: options.timeout,
        masterKey: options.masterKey
      };
      return this.rest.request('POST', '/signup', _options);
    }
  }, {
    key: "signIn",
    value: function signIn(user) {
      var _this = this;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _options = {
        body: user,
        timeout: options.timeout,
        masterKey: options.masterKey
      };
      return this.rest.request('POST', '/signin', _options).then(function (response) {
        _this.rest.setSession(response.sessionToken);
        return response;
      });
    }
  }, {
    key: "getCurrentUser",
    value: function getCurrentUser() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _options = {
        timeout: options.timeout,
        session: options.session,
        masterKey: options.masterKey
      };
      return this.rest.request('GET', '/me', _options);
    }
  }, {
    key: "signOut",
    value: function signOut() {
      var _this2 = this;
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _options = {
        timeout: options.timeout,
        session: options.session
      };
      return this.rest.request('POST', '/signout').then(function (response) {
        _this2.rest.clearSession();
        return response;
      })["catch"](function () {
        _this2.rest.clearSession();
      });
    }
  }, {
    key: "resetPassword",
    value: function resetPassword(email, options) {
      var _options = {
        body: {
          email: email,
          timeout: options.timeout,
          session: options.session,
          masterKey: options.masterKey
        }
      };
      return this.rest.request('POST', '/reset/', _options);
    }
  }]);
}();
module.exports = User;