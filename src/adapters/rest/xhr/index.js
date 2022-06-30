const XhrAdapter = require('./XhrAdapter')

function getXhrAdapter() {
    let XHR = null;
    if (XMLHttpRequest) {
        XHR = XMLHttpRequest;
    } else {
        throw new Error('XMLHttpRequest was found.');
    }
    return new XhrAdapter(XHR);
}

module.exports = getXhrAdapter
