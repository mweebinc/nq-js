const offCanvas = require('./offCanvas');
const resize = require('./resize');


function imageResize(image, maxWidth, maxHeight) {
    const {width, height} = resize(image.width, image.height, maxWidth, maxHeight);
    const canvas = offCanvas(width, height);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, width, height);
    return canvas;
}

module.exports = imageResize;
