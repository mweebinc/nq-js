function resize(currentWidth, currentHeight, targetWidth, targetHeight, allowUpscale = true) {
    // Calculate the width and height scale factors
    const widthScale = targetWidth / currentWidth;
    const heightScale = targetHeight / currentHeight;
    // Use the smaller of the two scale factors to ensure aspect ratio is maintained
    let scale = Math.min(widthScale, heightScale);
    // If allowUpscale is false and the scale is greater than 1, then don't upscale the image
    if (!allowUpscale && scale > 1) {
        scale = 1;
    }
    // Apply the scale to the current dimensions
    currentWidth *= scale;
    currentHeight *= scale;
    // Return the new dimensions
    return { width: currentWidth, height: currentHeight };
}

module.exports = resize;
