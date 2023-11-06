const urlToImage = require('./urlToImage');
function canvasToBlob(canvas, fileType = 'image/jpeg') {
    const dataURL = canvas.toDataURL(fileType);
    return urlToImage(dataURL, 'anonymous');
}

module.exports = canvasToBlob;
