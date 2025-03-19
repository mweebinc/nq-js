"use strict";

var HttpRestAdapter = require('./HttpRestAdapter');
var http = require('http');
function getHttpRestAdapter() {
  return new HttpRestAdapter(http);
}
module.exports = getHttpRestAdapter;