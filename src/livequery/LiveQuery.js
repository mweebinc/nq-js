const EventEmitter = require("events");
const Config = require("../Config");
const Socket = require("../adapters/socket/ws/Socket");
const LiveQueryConnection = require("./LiveQueryConnection");
/**
 * The static object for LiveQuery features
 * @type {EventEmitter}
 */
const LiveQuery = new EventEmitter();

/**
 * Create single instance of the Connection
 * @type {{getInstance: (function(): LiveQueryConnection)}}
 */
const Connection = (function () {
  let instance;

  function createInstance() {
    const url =
      Config.get("LIVEQUERY_SERVER_URL") ||
      Config.get("SERVER_URL").replace("http", "ws");
    const applicationId = Config.get("APPLICATION_ID");
    // @todo token to be implemented
    const token = Config.get("APPLICATION_ID");
    const connection = new LiveQueryConnection(applicationId, new Socket(url));
    connection.on("open", () => LiveQuery.emit("open"));
    connection.on("error", (error) => LiveQuery.emit("error", error));
    connection.on("close", () => LiveQuery.emit("close"));
    return connection;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

/**
 * Static open function
 */
LiveQuery.open = () => {
  const connection = Connection.getInstance();
  connection.open();
};
/**
 * Static subscribe function
 * @param query
 * @param type - the type of operation to subscribe to (e.g., afterUpdate, afterInsert, afterDelete)
 * @returns {*}
 */
LiveQuery.subscribe = (query, type) => {
  const connection = Connection.getInstance();
  return connection.subscribe(query, type);
};
/**
 * Static unsubscribe function
 * @param subcription
 */
LiveQuery.unsubscribe = (subcription) => {
  const connection = Connection.getInstance();
  connection.unsubscribe(subcription);
};
/**
 * Static close function
 */
LiveQuery.close = () => {
  const connection = Connection.getInstance();
  connection.close();
};

module.exports = LiveQuery;
