"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Config = require('../Config');
var getController = require('../controllers/rest');
var ENDPOINT = '/files/';
var File = /*#__PURE__*/function () {
  function File() {
    _classCallCheck(this, File);
    this.rest = getController();
  }
  return _createClass(File, [{
    key: "save",
    value: function save(blob) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _options = {
        body: blob,
        headers: {
          'Content-Type': blob.type
        },
        progress: options.progress
      };
      return this.rest.request('POST', ENDPOINT + blob.name, _options, options.session);
    }
  }, {
    key: "delete",
    value: function _delete(path) {
      var url = new URL(path);
      var name = url.pathname.split('/').pop();
      return this.rest.request('DELETE', ENDPOINT + name);
    }
  }], [{
    key: "get",
    value: function get(path) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        applicationId = _ref.applicationId;
      if (path && path.startsWith('http')) {
        var search = Object.fromEntries(new URLSearchParams(window.location.search));
        applicationId = applicationId || search.applicationId || Config.get('APPLICATION_ID');
        path = path.split('/').pop();
        return Config.get('SERVER_URL') + '/files/' + applicationId + '/' + path;
      }
      return path;
    }

    // deprecated
  }, {
    key: "getFile",
    value: function getFile(path) {
      path = path.split('/').pop();
      return Config.get('SERVER_URL') + '/files/' + Config.get('APPLICATION_ID') + '/' + path;
    }

    // deprecated
  }, {
    key: "getPath",
    value: function getPath(path) {
      path = path.split('/').pop();
      return Config.get('SERVER_URL') + '/files/' + Config.get('APPLICATION_ID') + '/' + path;
    }
  }, {
    key: "getFilename",
    value: function getFilename(url) {
      // return path.split('/').pop();
      var pathname = new URL(url).pathname;
      var filename = pathname.split('/').pop(); // Get the last segment of the pathname
      return decodeURIComponent(filename); // Decode any percent-encoded characters
    }
  }]);
}();
module.exports = File;