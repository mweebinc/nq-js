"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Config = require('./Config');
var Queue = /*#__PURE__*/function () {
  function Queue() {
    _classCallCheck(this, Queue);
  }
  return _createClass(Queue, null, [{
    key: "setUrl",
    value: function setUrl(value) {
      Config.set('SERVER_URL', value);
    }
  }, {
    key: "setApplicationId",
    value: function setApplicationId(value) {
      Config.set('APPLICATION_ID', value);
    }
  }]);
}(); // Assign classes to Queue
Queue.Schema = require('./domain/Schema');
Queue.Document = require('./domain/Document');
Queue.User = require('./domain/User');
Queue.File = require('./domain/File');
Queue.Email = require('./domain/Email');
Queue.Payment = require('./domain/Payment');
Queue.Rest = require('./domain/Rest');
Queue.LiveQuery = require('./livequery/LiveQuery');

// Assign functions to Queue
Queue.blobToDataUrl = require('./blobToDataUrl');
Queue.blobToImage = require('./blobToImage');
Queue.canvasToBlob = require('./canvasToBlob');
Queue.canvasToImage = require('./canvasToImage');
Queue.resize = require('./resize');
Queue.imageResize = require('./imageResize');
Queue.imageToCanvas = require('./imageToCanvas');
Queue.createPromise = require('./createPromise');
Queue.urlToImage = require('./urlToImage');
Queue.flatten = require('./flatten');
Queue.unflatten = require('./unflatten');
Queue.browseFile = require('./browseFile');
Queue.parseName = require('./parseName');
Queue.parse = require('./parse');
Queue.downloadFromURL = require('./downloadFromURL');
Queue.nameToNumber = require('./nameToNumber');
Queue.formatNumber = require('./formatNumber');
Queue.dateToMMDDYY = require('./dateToMMDDYY');
Queue.dateFormat = require('./dateFormat');
Queue.NFCReader = require('./NFCReader');
Queue.onHIDScanner = require('./onHIDScanner');
Queue.click = require('./click');
Queue.nodeToJson = require('./nodeToJson');
Queue.Config = Config;
module.exports = Queue;