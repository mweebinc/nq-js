"use strict";

var urlToImage = require('./urlToImage');
function canvasToBlob(canvas) {
  var fileType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'image/jpeg';
  var dataURL = canvas.toDataURL(fileType);
  return urlToImage(dataURL, 'anonymous');
}
module.exports = canvasToBlob;