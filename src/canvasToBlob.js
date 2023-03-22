function canvasToBlob(canvas, fileName, fileType = 'image/jpeg', quality = 1, fileLastModified = Date.now()) {
    return Promise.resolve()
        .then(() => {
            if (typeof OffscreenCanvas === 'function' && canvas instanceof OffscreenCanvas) {
                return canvas.convertToBlob({type: fileType, quality});
            }
            return new Promise(resolve => canvas.toBlob(resolve, fileType, quality));
        }).then(file => {
            file.name = fileName
            file.lastModified = fileLastModified
            return file;
        });
}

module.exports = canvasToBlob;
