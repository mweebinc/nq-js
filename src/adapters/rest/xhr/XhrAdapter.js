// import handleProgress from './handleProgress';
const handleProgress = require('./handleProgress');
// import resolvingPromise from './resolvingPromise';
const resolvingPromise = require('./resolvingPromise')
const ParseError = require('./ParseError')
// import ParseError from './ParseError';

class XhrAdapter {
    constructor(XHR) {
        this.XHR = XHR;
    }

    request(url, options) {
        const promise = resolvingPromise();
        if (this.XHR == null) {
            throw new Error('Cannot make a request: No definition of XMLHttpRequest was found.');
        }
        const xhr = new this.XHR();
        xhr.timeout = 10000; //10 seconds
        const UNSENT = 0; // initial state
        const OPENED = 1; // open called
        const HEADERS_RECEIVED = 2; // response headers received
        const LOADING = 3; // response is loading (a data packet is received)
        const DONE = 4; // request complete
        if (options.raw) {
            xhr.responseType = "blob";
        }
        xhr.onreadystatechange = function () {
            switch (xhr.readyState) {
                case UNSENT:
                    break;
                case OPENED:
                    break;
                case HEADERS_RECEIVED:
                    break;
                case LOADING:
                    // partial data received
                    // console.log(xhr.response);
                    // console.log("");
                    break;
                case DONE:
                    break;
            }
        }
        xhr.onload = function () {
            let response;
            try {
                response = options.raw ? xhr.response : JSON.parse(xhr.response);
            } catch (e) {
                promise.reject(e.toString());
            }
            if (xhr.status >= 200 && xhr.status < 300) {
                promise.resolve(response);
            } else {
                promise.reject(response);
            }
        }
        xhr.onprogress = event => {
            handleProgress('download', event, options);
        };
        if (xhr.upload) {
            xhr.upload.onprogress = event => {
                handleProgress('upload', event, options);
            };
        }
        xhr.onerror = function (e) {
            promise.reject(new ParseError(ParseError.CONNECTION_FAILED, 'Unable to connect to the internet'));
        };
        xhr.onabort = function () {
            // no action for now
        };
        //prepare connection
        xhr.open(options.method, url);
        for (const h in options.headers) {
            xhr.setRequestHeader(h, options.headers[h]);
        }
        //send request
        xhr.send(options.body);
        return promise;
    }
}

// export default XhrAdapter;
module.exports = XhrAdapter;