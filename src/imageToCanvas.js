function imageToCanvas(image) {
    const temp = document.createElement('canvas');
    temp.width = image.width;
    temp.height = image.height;
    temp.getContext('2d').drawImage(image, 0, 0, temp.width, image.height);
    // temp.getContext('2d').putImageData(image, 0, 0);
    return temp;
}

module.exports = imageToCanvas;