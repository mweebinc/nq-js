// import XhrAdapter from './XhrAdapter';
const  XhrAdapter = require('./XhrAdapter')
const GetLocalStorageAdapter = require("../../cache/local/index");
const UserCache = require('../../../data/user/source/UserCache');

const memoryAdapter = new GetLocalStorageAdapter(NaN)
const userCache = new UserCache(memoryAdapter)

function getXhrAdapter() {
    let XHR = null;
    if (XMLHttpRequest) {
        XHR = XMLHttpRequest;
    } else {
        throw new Error('XMLHttpRequest was found.');
    }
    return new XhrAdapter(XHR, userCache);
}

// export default getXhrAdapter;
module.exports = getXhrAdapter