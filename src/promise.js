/**
 * Create a promise variable
 * @returns {Promise<>}
 */
function promise() {
    let resolve;
    let reject;
    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
}

module.exports = promise;
