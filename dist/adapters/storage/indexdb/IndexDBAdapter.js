"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var IndexedDB = /*#__PURE__*/function () {
  function IndexedDB(dbName, version) {
    _classCallCheck(this, IndexedDB);
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  // Open or create IndexedDB
  return _createClass(IndexedDB, [{
    key: "open",
    value: function open() {
      var _this = this;
      return new Promise(function (resolve, reject) {
        if (_this.db) {
          resolve(_this.db);
          return;
        }
        var request = indexedDB.open(_this.dbName, _this.version);
        request.onupgradeneeded = function (event) {
          _this.db = event.target.result;
          // Create collections as object stores
          if (!_this.db.objectStoreNames.contains('documents')) {
            _this.db.createObjectStore('documents', {
              keyPath: 'id'
            });
          }
        };
        request.onsuccess = function (event) {
          _this.db = event.target.result;
          resolve(_this.db);
        };
        request.onerror = function (event) {
          console.error("IndexedDB error:", event.target.error);
          reject(event.target.error);
        };
      });
    }

    // Generic method to handle transactions
  }, {
    key: "_transaction",
    value: function _transaction(storeName, mode, action) {
      return this.open().then(function (db) {
        return new Promise(function (resolve, reject) {
          var transaction = db.transaction([storeName], mode);
          var objectStore = transaction.objectStore(storeName);
          var request = action(objectStore);
          request.onsuccess = function () {
            return resolve(request.result);
          };
          request.onerror = function () {
            return reject(request.error);
          };
          transaction.onerror = function (event) {
            console.error("Transaction error:", event.target.error);
            reject(event.target.error);
          };
        });
      });
    }

    // Add or update a document in the store
  }, {
    key: "insert",
    value: function insert(object) {
      return this._transaction('documents', 'readwrite', function (store) {
        return store.put(object);
      });
    }

    // Retrieve a document by id
  }, {
    key: "getDocument",
    value: function getDocument(id) {
      return this._transaction('documents', 'readonly', function (store) {
        return store.get(id);
      });
    }

    // Remove a document by id
  }, {
    key: "deleteDocument",
    value: function deleteDocument(id) {
      return this._transaction('documents', 'readwrite', function (store) {
        return store["delete"](id);
      });
    }

    // Retrieve all documents
  }, {
    key: "find",
    value: function find() {
      return this._transaction('documents', 'readonly', function (store) {
        return store.getAll();
      });
    }
  }]);
}();
var _default = exports["default"] = IndexedDB;