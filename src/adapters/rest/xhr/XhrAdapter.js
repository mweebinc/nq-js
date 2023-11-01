const handleProgress = require('./handleProgress');
const resolvingPromise = require('./resolvingPromise')
const ParseError = require('./ParseError')

const UNSENT = 0; // initial state
const OPENED = 1; // open called
const HEADERS_RECEIVED = 2; // response headers received
const LOADING = 3; // response is loading (a data packet is received)
const DONE = 4; // request complete
const REQUEST_ATTEMPT_LIMIT = 5

class XhrAdapter {
    /**
     * @param XHR
     * @param timeout no timeout by default
     */
    constructor(XHR, timeout = 0) {
        this.XHR = XHR;
        this.timeout = timeout;
    }

    request(url, options) {
        const promise = resolvingPromise();
        let attempts = 0;
        // arrow function to use .this
        const dispatch = () => {
            if (this.XHR == null) {
                throw new Error('Cannot make a request: No definition of XMLHttpRequest was found.');
            }
            const xhr = new this.XHR();
            this.currentXhr = xhr;
            xhr.timeout = options.timeout ?? this.timeout;
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
                console.error('error', e);
                retry(xhr);
            };
            xhr.onabort = function () {
                // no action for now
            };
            xhr.ontimeout = function () {
                console.error('Request timed out');
                retry(xhr);
            };
            //prepare connection
            xhr.open(options.method, url);
            for (const h in options.headers) {
                xhr.setRequestHeader(h, options.headers[h]);
            }
            // send request
            xhr.send(options.body);
        }
        // Retry logic separated into its own method
        const retry = (xhr) => {
            // Log the retry
            console.log(`Retrying... attempts left: ${attempts}`);
            // Delay and retry
            // retry on 5XX or node-xmlhttprequest error
            if (++attempts < REQUEST_ATTEMPT_LIMIT) {
                // Exponentially-growing random delay
                const delay = Math.round(Math.random() * 125 * Math.pow(2, attempts));
                console.log('delay', delay);
                setTimeout(dispatch, delay);
            } else if (xhr.status === 0) {
                promise.reject(new ParseError(ParseError.CONNECTION_FAILED, 'Unable to connect to the internet'));
            } else {
                // After the retry limit is reached, fail
                promise.reject(xhr.response);
            }
        }
        dispatch();
        return promise;
    }

    abort() {
        // cancel request
        if (this.currentXhr) {
            this.currentXhr.abort();
        }
    }
}

module.exports = XhrAdapter;