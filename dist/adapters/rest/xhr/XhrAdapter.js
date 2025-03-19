"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var handleProgress = require('./handleProgress');
var handleChunk = require('./handleChunk');
var createPromise = require('../../../createPromise');
var UNSENT = 0; // initial state
var OPENED = 1; // open called
var HEADERS_RECEIVED = 2; // response headers received
var LOADING = 3; // response is loading (a data packet is received)
var DONE = 4; // request complete
var REQUEST_ATTEMPT_LIMIT = 10;
var XhrAdapter = /*#__PURE__*/function () {
  /**
   * @param XHR
   * @param timeout no timeout by default
   */
  function XhrAdapter(XHR) {
    var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    _classCallCheck(this, XhrAdapter);
    this.XHR = XHR;
    this.timeout = timeout;
    this.position = 0;
  }
  return _createClass(XhrAdapter, [{
    key: "request",
    value: function request(url, options) {
      var _this = this;
      var promise = createPromise();
      var attempts = 0;
      // arrow function to use .this
      var dispatch = function dispatch() {
        var _options$timeout;
        if (_this.XHR == null) {
          throw new Error('Cannot make a request: No definition of XMLHttpRequest was found.');
        }
        var xhr = new _this.XHR();
        _this.currentXhr = xhr;
        xhr.timeout = (_options$timeout = options.timeout) !== null && _options$timeout !== void 0 ? _options$timeout : _this.timeout;
        if (options.raw) {
          xhr.responseType = "blob";
        }
        xhr.onreadystatechange = function () {
          switch (xhr.readyState) {
            case UNSENT:
              break;
            case OPENED:
              break;
            case HEADERS_RECEIVED:
              break;
            case LOADING:
            case DONE:
              if (options && typeof options.onData === 'function') {
                // partial data received
                var _handleChunk = handleChunk(xhr.responseText, _this.position),
                  _handleChunk2 = _slicedToArray(_handleChunk, 2),
                  objects = _handleChunk2[0],
                  remain = _handleChunk2[1];
                _this.position = remain;
                options.onData(objects);
              }
              break;
          }
        };
        xhr.onload = function () {
          var response;
          try {
            response = options.raw ? xhr.response : JSON.parse(xhr.response);
          } catch (e) {
            promise.reject(e.toString());
          }
          if (xhr.status >= 200 && xhr.status < 300) {
            promise.resolve(response);
          } else {
            promise.reject(response);
          }
        };
        xhr.onprogress = function (event) {
          handleProgress('download', event, options);
        };
        if (xhr.upload) {
          xhr.upload.onprogress = function (event) {
            handleProgress('upload', event, options);
          };
        }
        xhr.onerror = function () {
          retry(xhr);
        };
        xhr.onabort = function () {
          // no action for now
        };
        xhr.ontimeout = function () {
          console.error('Request timed out');
          retry(xhr);
        };
        //prepare connection
        xhr.open(options.method, url);
        for (var h in options.headers) {
          xhr.setRequestHeader(h, options.headers[h]);
        }
        // send request
        xhr.send(options.body);
      };
      // Retry logic separated into its own method
      var retry = function retry(xhr) {
        // Log the retry
        console.log("Retrying... attempts left: ".concat(attempts));
        // Delay and retry
        // retry on 5XX or node-xmlhttprequest error
        if (++attempts < REQUEST_ATTEMPT_LIMIT) {
          // Exponentially-growing random delay
          var delay = Math.round(Math.random() * 125 * Math.pow(2, attempts));
          console.log('delay', delay);
          setTimeout(dispatch, delay);
        } else if (xhr.status === 0) {
          promise.reject('Unable to connect to the internet');
          // promise.reject(new ParseError(ParseError.CONNECTION_FAILED, 'Unable to connect to the internet'));
        } else {
          // After the retry limit is reached, fail
          promise.reject(xhr.response);
        }
      };
      dispatch();
      return promise;
    }
  }, {
    key: "abort",
    value: function abort() {
      // cancel request
      if (this.currentXhr) {
        this.currentXhr.abort();
      }
    }
  }]);
}();
module.exports = XhrAdapter;