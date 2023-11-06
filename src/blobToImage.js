const urlToImage = require('./urlToImage');
const blobToDataUrl = require('./blobToDataUrl');
async function blobToImage(blob) {
    const dataURL = await blobToDataUrl(blob);
    return urlToImage(dataURL, 'anonymous');
}

module.exports = blobToImage;
