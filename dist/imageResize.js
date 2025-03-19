"use strict";

var offCanvas = require('./offCanvas');
var resize = require('./resize');
function imageResize(image, maxWidth, maxHeight) {
  var _resize = resize(image.width, image.height, maxWidth, maxHeight),
    width = _resize.width,
    height = _resize.height;
  var canvas = offCanvas(width, height);
  var context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, width, height);
  return canvas;
}
module.exports = imageResize;