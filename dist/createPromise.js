"use strict";

/**
 * Create a createPromise variable
 * @returns {Promise<>}
 */
function createPromise() {
  var resolve;
  var reject;
  var promise = new Promise(function (_resolve, _reject) {
    resolve = _resolve;
    reject = _reject;
  });
  promise.resolve = resolve;
  promise.reject = reject;
  return promise;
}
module.exports = createPromise;