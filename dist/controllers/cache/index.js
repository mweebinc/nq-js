"use strict";

var CacheController = require('./CacheController');
function getCacheController(ttl) {
  var adapter;
  if (window) {
    var getCacheAdapter = require('../../adapters/cache/local');
    adapter = getCacheAdapter();
  } else {}
  return new CacheController(adapter, ttl);
}
module.exports = getCacheController;