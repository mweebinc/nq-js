"use strict";

var XhrAdapter = require('./XhrAdapter');
function getXhrAdapter() {
  var XHR = null;
  if (XMLHttpRequest) {
    XHR = XMLHttpRequest;
  } else {
    throw new Error('XMLHttpRequest was found.');
  }
  return new XhrAdapter(XHR);
}
module.exports = getXhrAdapter;