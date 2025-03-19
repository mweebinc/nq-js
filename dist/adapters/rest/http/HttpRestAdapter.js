"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var HttpRestAdapter = /*#__PURE__*/function () {
  function HttpRestAdapter(http) {
    _classCallCheck(this, HttpRestAdapter);
    this.http = http;
  }
  return _createClass(HttpRestAdapter, [{
    key: "request",
    value: function request(url) {
      var _this = this;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return new Promise(function (resolve, reject) {
        if (_this.http === null) {
          throw new Error('Cannot make a request. No HTTP Request found.');
        }
        var http = _this.http;
        var req = http.request(url, options, function (res) {
          var chunks = [];
          res.on('data', function (chunk) {
            chunks.push(chunk);
          });
          res.on('end', function () {
            var body = Buffer.concat(chunks).toString();
            try {
              resolve(JSON.parse(body));
            } catch (error) {
              reject(error);
            }
          });
          res.on('error', function (error) {
            reject(error);
          });
        });
        options.body && req.write(options.body);
        req.end();
      });
    }
  }]);
}();
module.exports = HttpRestAdapter;