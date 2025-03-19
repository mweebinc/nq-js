"use strict";

function resize(currentWidth, currentHeight, targetWidth, targetHeight) {
  var allowUpscale = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  // Calculate the width and height scale factors
  var widthScale = targetWidth / currentWidth;
  var heightScale = targetHeight / currentHeight;
  // Use the smaller of the two scale factors to ensure aspect ratio is maintained
  var scale = Math.min(widthScale, heightScale);
  // If allowUpscale is false and the scale is greater than 1, then don't upscale the image
  if (!allowUpscale && scale > 1) {
    scale = 1;
  }
  // Apply the scale to the current dimensions
  currentWidth *= scale;
  currentHeight *= scale;
  // Return the new dimensions
  return {
    width: currentWidth,
    height: currentHeight
  };
}
module.exports = resize;