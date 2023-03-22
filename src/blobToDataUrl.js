function blobToDataUrl(blob){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(blob);
    });
}
module.exports = blobToDataUrl;
