"use strict";

var EventEmitter = require("events");
var Config = require("../Config");
var Socket = require("../adapters/socket/ws/Socket");
var LiveQueryConnection = require("./LiveQueryConnection");
/**
 * The static object for LiveQuery features
 * @type {EventEmitter}
 */
var LiveQuery = new EventEmitter();

/**
 * Create single instance of the Connection
 * @type {{getInstance: (function(): LiveQueryConnection)}}
 */
var Connection = function () {
  var instance;
  function createInstance() {
    var url = Config.get("LIVEQUERY_SERVER_URL") || Config.get("SERVER_URL").replace("http", "ws");
    var applicationId = Config.get("APPLICATION_ID");
    // @todo token to be implemented
    var token = Config.get("APPLICATION_ID");
    var connection = new LiveQueryConnection(applicationId, new Socket(url));
    connection.on("open", function () {
      return LiveQuery.emit("open");
    });
    connection.on("error", function (error) {
      return LiveQuery.emit("error", error);
    });
    connection.on("close", function () {
      return LiveQuery.emit("close");
    });
    return connection;
  }
  return {
    getInstance: function getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
}();

/**
 * Static open function
 */
LiveQuery.open = function () {
  var connection = Connection.getInstance();
  connection.open();
};
/**
 * Static subscribe function
 * @param query
 * @param type - the type of operation to subscribe to (e.g., afterUpdate, afterInsert, afterDelete)
 * @returns {*}
 */
LiveQuery.subscribe = function (query, type) {
  var connection = Connection.getInstance();
  return connection.subscribe(query, type);
};
/**
 * Static unsubscribe function
 * @param subcription
 */
LiveQuery.unsubscribe = function (subcription) {
  var connection = Connection.getInstance();
  connection.unsubscribe(subcription);
};
/**
 * Static close function
 */
LiveQuery.close = function () {
  var connection = Connection.getInstance();
  connection.close();
};
module.exports = LiveQuery;