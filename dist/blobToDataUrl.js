"use strict";

function blobToDataUrl(blob) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onload = function () {
      return resolve(reader.result);
    };
    reader.onerror = function (e) {
      return reject(e);
    };
    reader.readAsDataURL(blob);
  });
}
module.exports = blobToDataUrl;