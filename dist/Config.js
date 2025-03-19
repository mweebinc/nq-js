"use strict";

// global data
var config = {
  SERVER_URL: "https://api.innque.com/v1",
  APPLICATION_ID: null,
  LIVEQUERY_SERVER_URL: "wss://ws.innque.com"
};
/**
 * A singleton object responsible for App configuration
 */
var Config = {
  get: function get(key) {
    if (config.hasOwnProperty(key)) {
      if (key === "APPLICATION_ID") {
        return config[key] || window.localStorage.getItem(key);
      }
      return config[key];
    }
    throw new Error("Configuration key not found.");
  },
  set: function set(key, value) {
    config[key] = value;
  }
};
module.exports = Config;