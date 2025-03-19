"use strict";

function offCanvas(width, height) {
  var canvas;
  try {
    canvas = new OffscreenCanvas(width, height);
  } catch (e) {
    canvas = document.createElement('canvas');
  }
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
module.exports = offCanvas;