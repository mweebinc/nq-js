function resize(currentWidth, currentHeight, maxWidth, maxHeight) {
    let width = currentWidth;
    let height = currentHeight;
    if (width > height) {
        if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
        }
    } else {
        if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
        }
    }
    return {width, height};
}

module.exports = resize;
