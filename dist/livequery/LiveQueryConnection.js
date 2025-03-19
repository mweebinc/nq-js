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
var LiveQueryClient = require("./LiveQueryClient");
var EventEmitter = require("events");
var promise = require("../createPromise");
var Subscription = require("./Subscription");

/**
 * The connection State
 * @type {{}}
 */
var STATE = {
  INITIALIZED: "initialized",
  CONNECTING: "connecting",
  CONNECTED: "connected",
  CLOSED: "closed",
  RECONNECTING: "reconnecting",
  DISCONNECTED: "disconnected"
};

/**
 * This class handle the connection state of the LiveQueryClient
 */
var LiveQueryConnection = /*#__PURE__*/function (_EventEmitter) {
  /**
   * @param ws WebSocketAdapter
   * @param applicationId The current Application ID
   * @param sessionToken Session token of current user
   */
  function LiveQueryConnection(applicationId, ws, sessionToken) {
    var _this;
    _classCallCheck(this, LiveQueryConnection);
    _this = _callSuper(this, LiveQueryConnection);
    _this.client = new LiveQueryClient(applicationId, ws, sessionToken);
    _this.ws = ws;
    _this.state = STATE.INITIALIZED;
    _this.connectionPromise = promise();
    _this.attempts = 1; // reconnect attempts
    // Bind WebSocket callbacks
    _this.ws.on("open", _this._onOpen.bind(_this));
    _this.ws.on("message", _this._onMessage.bind(_this));
    _this.ws.on("close", _this._onClose.bind(_this));
    _this.ws.on("error", _this._onError.bind(_this));
    // prevent Unhandled error
    _this.on("error", function () {});
    return _this;
  }

  /**
   * Open the connection
   */
  _inherits(LiveQueryConnection, _EventEmitter);
  return _createClass(LiveQueryConnection, [{
    key: "open",
    value: function open() {
      // prevent to call open again
      if (this.state === STATE.CONNECTING || this.state === STATE.CONNECTED) {
        return;
      }
      // change current state to connecting
      if (this.state !== STATE.RECONNECTING) {
        this.state = STATE.CONNECTING;
      }
      this.ws.open();
    }

    /**
     * Close the connection
     */
  }, {
    key: "close",
    value: function close() {
      // check if already close
      if (this.state === STATE.INITIALIZED || this.state === STATE.DISCONNECTED) {
        return;
      }
      this.state = STATE.DISCONNECTED;
      this.client.close(this.connectionPromise, true);
      this.ws.close();
      this.emit("close");
    }

    /**
     * Subscribe to the collection
     * @param query
     * @param type - the type of operation to subscribe to (e.g., afterUpdate, afterInsert, afterDelete)
     * @returns {Subscription}
     */
  }, {
    key: "subscribe",
    value: function subscribe(query, type) {
      return this.client.subscribe(query, this.connectionPromise, type);
    }

    /**
     * Unsubscribe to the collection
     * @param subscription @type {Subscription}
     */
  }, {
    key: "unsubscribe",
    value: function unsubscribe(subscription) {
      this.client.unsubscribe(subscription, this.connectionPromise);
    }

    /**
     * When the connection is open
     * @private
     */
  }, {
    key: "_onOpen",
    value: function _onOpen() {
      this.client.connect();
      this.emit("open");
    }

    /**
     * When server send the data
     * @private
     */
  }, {
    key: "_onMessage",
    value: function _onMessage(data) {
      var subscription = this.client.subscriptions.get(data.subscriptionId);
      switch (data.operation) {
        case "connected":
          // if state from reconnecting resubscribe all subscriptions
          if (this.state === STATE.RECONNECTING) {
            this.client.resubscribe(this.connectionPromise);
          }
          this.state = STATE.CONNECTED;
          this.connectionPromise.resolve();
          this.emit("open");
          break;
        case "subscribed":
          if (subscription) {
            subscription.subscribed = true;
            subscription.emit(Subscription.SUBSCRIBE, data);
          }
          break;
        case "unsubscribed":
          if (subscription) {
            subscription.subscribed = false;
            this.client.subscriptions["delete"](subscription.id);
            subscription.emit(Subscription.CLOSE);
          }
          break;
        case "error":
          this.emit("error", data.error);
          this.connectionPromise.reject(data);
          this.state = STATE.DISCONNECTED;
          break;
        default:
          // create, update, delete, enter, leave cases
          if (subscription && subscription.subscribed) {
            switch (data.operation) {
              case "afterInsert":
                subscription.emit(Subscription.CREATE, data.object);
                break;
              case "afterUpdate":
                subscription.emit(Subscription.UPDATE, data.object);
                break;
              case "afterDelete":
                subscription.emit(Subscription.DELETE, data.object);
                break;
              default:
                console.warn("Unhandled operation:", data.operation);
            }
          }
      }
    }

    /**
     * When connection is closed
     * @private
     */
  }, {
    key: "_onClose",
    value: function _onClose() {
      if (this.state !== STATE.CONNECTED) {
        return;
      }
      this.state = STATE.CLOSED;
      this.emit("close");
      // notify all subscription about close
      this.client.close();
      this._reconnect();
    }

    /**
     * When error occurs
     * @param error
     * @private
     */
  }, {
    key: "_onError",
    value: function _onError(error) {
      console.error("WebSocket Error:", error);
      this.emit("error", error);
      // @todo
      // for (const subscription of this.client.subscriptions.values()) {
      //     subscription.emit(Subscription.ERROR, error);
      // }
      this._reconnect();
    }

    /**
     * Reconnect to the server
     * @private
     */
  }, {
    key: "_reconnect",
    value: function _reconnect() {
      var _this2 = this;
      // if disconnected or currently reconnecting we stop attempting to reconnect
      if (this.state === STATE.DISCONNECTED || this.state === STATE.RECONNECTING) {
        return;
      }
      this.state = STATE.RECONNECTING;
      if (this.reconnectTimeoutId) {
        clearTimeout(this.reconnectTimeoutId);
      }
      // reconnect at frequent rates
      var time = Math.random() * Math.min(30, Math.pow(2, this.attempts) - 1) * 1000;
      this.reconnectTimeoutId = setTimeout(function () {
        _this2.attempts++;
        _this2.connectionPromise = promise();
        _this2.open();
      }, time);
    }

    /**
     * Reset all variable
     * @private
     */
  }, {
    key: "_reset",
    value: function _reset() {
      this.id = 0;
      this.connectPromise = promise();
    }
  }]);
}(EventEmitter);
LiveQueryConnection.STATE = STATE;
module.exports = LiveQueryConnection;