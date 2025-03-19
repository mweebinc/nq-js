"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Subscription = require("./Subscription");

/**
 * This class handle the data sent to the Server
 */
var LiveQueryClient = /*#__PURE__*/function () {
  /**
   * @param ws WebSocketAdapter
   * @param applicationId The current Application ID
   * @param sessionToken Session token of current user
   */
  function LiveQueryClient(applicationId, ws, sessionToken) {
    _classCallCheck(this, LiveQueryClient);
    this.applicationId = applicationId;
    this.ws = ws;
    this.sessionToken = sessionToken;
    /**
     * @type {Map<string, Subscription>}
     */
    this.subscriptions = new Map();
    /**
     * Use number for autoincrement
     * Then convert to string when send to the server
     * @type {number}
     */
    this.subscriptionId = 1;
  }

  /**
   * Send connect operation to server
   */
  return _createClass(LiveQueryClient, [{
    key: "connect",
    value: function connect(session) {
      var data = {
        operation: "connect",
        applicationId: this.applicationId
      };
      if (this.sessionToken || session) {
        data.sessionToken = session || this.sessionToken;
      }
      this.ws.send(data);
    }

    /**
     * Send subscribe operation to server
     * @param query
     * @param type - the type of operation to subscribe to (e.g., afterUpdate, afterInsert, afterDelete)
     * @param connectionPromise
     * @returns {Subscription}
     */
  }, {
    key: "subscribe",
    value: function subscribe(query, connectionPromise, type) {
      var _this = this;
      var subscription = new Subscription(this.subscriptionId + "", query);
      this.subscriptions.set(subscription.id, subscription);
      this.subscriptionId++;
      var data = {
        operation: "subscribe",
        subscriptionId: subscription.id,
        type: type,
        query: query
      };
      connectionPromise.then(function () {
        return _this.ws.send(data);
      });
      // when subscription call the unsubscribe function
      subscription.on("unsubscribe", function () {
        return _this.unsubscribe(subscription, connectionPromise);
      });
      return subscription;
    }

    /**
     * send unsubscribe operation to server
     * @param subscription
     * @param connectionPromise
     */
  }, {
    key: "unsubscribe",
    value: function unsubscribe(subscription, connectionPromise) {
      var _this2 = this;
      if (subscription) {
        subscription.subscribed = false;
        var data = {
          operation: "unsubscribe",
          subscriptionId: subscription.id
        };
        connectionPromise.then(function () {
          return _this2.ws.send(data);
        });
      }
    }
  }, {
    key: "resubscribe",
    value: function resubscribe(connectionPromise) {
      var _this3 = this;
      this.subscriptions.forEach(function (subscription) {
        var data = {
          operation: "subscribe",
          subscriptionId: subscription.id,
          query: subscription.query
        };
        connectionPromise.then(function () {
          return _this3.ws.send(data);
        });
      });
    }

    /**
     * Close all subscriptions
     * @param connectionPromise
     * @param reset true if user close the connection false if unexpected disconnect
     */
  }, {
    key: "close",
    value: function close(connectionPromise) {
      var _this4 = this;
      var reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.subscriptions.forEach(function (subscription) {
        subscription.emit("close");
        // notify the server for unsubscription
        if (reset) _this4.unsubscribe(subscription, connectionPromise);
      });
      if (reset) {
        // reset the subscription
        this.subscriptions = new Map();
        this.subscriptionId = 1;
      }
    }
  }]);
}();
module.exports = LiveQueryClient;