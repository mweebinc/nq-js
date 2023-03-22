function urlToImage(src, crossOrigin = undefined) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.crossOrigin = crossOrigin;
        img.src = src;
    });
}

module.exports = urlToImage;
