"use strict";

var InMemoryCacheAdapter = require('./InMemoryCacheAdapter');
function getMemoryCacheAdapter(ttl) {
  return new InMemoryCacheAdapter(ttl);
}
module.exports = getMemoryCacheAdapter;