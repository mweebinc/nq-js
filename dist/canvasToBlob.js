"use strict";

function canvasToBlob(canvas, fileName) {
  var fileType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'image/jpeg';
  var quality = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var fileLastModified = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : Date.now();
  return Promise.resolve().then(function () {
    if (typeof OffscreenCanvas === 'function' && canvas instanceof OffscreenCanvas) {
      return canvas.convertToBlob({
        type: fileType,
        quality: quality
      });
    }
    return new Promise(function (resolve) {
      return canvas.toBlob(resolve, fileType, quality);
    });
  }).then(function (file) {
    file.name = fileName;
    file.lastModified = fileLastModified;
    return file;
  });
}
module.exports = canvasToBlob;