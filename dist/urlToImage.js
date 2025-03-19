"use strict";

function urlToImage(src) {
  var crossOrigin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.onload = function () {
      return resolve(img);
    };
    img.onerror = function (e) {
      return reject(e);
    };
    img.crossOrigin = crossOrigin;
    img.src = src;
  });
}
module.exports = urlToImage;