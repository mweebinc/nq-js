"use strict";

var click = require('./click');
var createPromise = require('./createPromise');

/**
 * @param accept file type
 * @param multiple
 * @returns {Promise | Promise<unknown>}
 */
function browseFile(accept, multiple) {
  var p = createPromise();
  var input = document.createElement('input');
  input.type = "file";
  input.accept = accept;
  input.multiple = multiple;
  input.onchange = function (e) {
    var files = e.target.files;
    p.resolve(files);
  };
  setTimeout(function () {
    click(input);
  }, 0);
  return p;
}
module.exports = browseFile;