"use strict";

var RestController = require('./RestController');
function getRestController() {
  var restAdapter;
  var cacheAdapter;
  if (window) {
    var getXhrAdapter = require('../../adapters/rest/xhr');
    var getCacheAdapter = require('../../adapters/cache/local');
    restAdapter = getXhrAdapter();
    cacheAdapter = getCacheAdapter(NaN);
  } else {
    // const getHttpRestAdapter = require('../adapters/rest/http');
    // const getMemoryCacheAdapter = require('../adapters/cache/memory');
    // restAdapter = getHttpRestAdapter();
    // cacheAdapter = getMemoryCacheAdapter(NaN);
  }
  return new RestController(restAdapter, cacheAdapter);
}
module.exports = getRestController;