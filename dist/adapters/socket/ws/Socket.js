"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var EventEmitter = require('events');

/**
 * Wrapper class for WebSocket Client
 */
var Socket = /*#__PURE__*/function (_EventEmitter) {
  /**
   * @param url The WebSocket Server
   * @param timeout The timeout ping pong
   */
  function Socket(url) {
    var _this;
    var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
    _classCallCheck(this, Socket);
    _this = _callSuper(this, Socket);
    _this.url = url;
    _this.timeout = timeout;
    return _this;
  }

  /**
   * Open new connection
   */
  _inherits(Socket, _EventEmitter);
  return _createClass(Socket, [{
    key: "open",
    value: function open() {
      var _this2 = this;
      this.ws = new WebSocket(this.url);
      this.ws.onopen = function () {
        _this2.waitingForPong = false;
        // heartbeat
        // send ping to server periodically
        // if no pong within in time interval socket will be disconnected
        var pingIntervalId = setInterval(function () {
          if (!_this2.waitingForPong) {
            _this2.ws.send('ping');
            _this2.waitingForPong = true;
          } else {
            clearInterval(pingIntervalId);
            _this2.ws.close();
          }
        }, _this2.timeout * 1000);
        _this2.emit('open');
      };
      this.ws.onmessage = function (message) {
        message = message && message.data ? message.data : message;
        if (message === 'pong') {
          _this2.waitingForPong = false;
          return;
        }
        try {
          message = JSON.parse(message);
        } catch (e) {
          console.log('unable to parse request', message, e);
          return;
        }
        _this2.emit('message', message);
      };
      this.ws.onclose = function () {
        return _this2.emit('close');
      };
      this.ws.onerror = function (error) {
        return _this2.emit('error', error);
      };
    }

    /**
     * Send JSON data
     * @param data @type {{}}
     */
  }, {
    key: "send",
    value: function send(data) {
      try {
        data = JSON.stringify(data);
      } catch (error) {
        console.log('unable to parse data', data, e);
        return;
      }
      this.ws.send(data);
    }

    /**
     * Close the connection
     */
  }, {
    key: "close",
    value: function close() {
      this.ws.close();
    }
  }]);
}(EventEmitter);
module.exports = Socket;