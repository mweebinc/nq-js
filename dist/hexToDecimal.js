"use strict";

/**
 * Converts a formatted hexadecimal string to its equivalent decimal value.
 *
 * The function assumes the hexadecimal string is presented in a format where the byte order
 * is reversed from the traditional representation. For example, the string '5b:6a:f6:f4'
 * represents the bytes in the order 5b, 6a, f6, f4, but the actual byte order for conversion
 * is f4, f6, 6a, 5b.
 *
 * @param {string} hexString - The formatted hexadecimal string (e.g., '5b:6a:f6:f4').
 * @returns {number} The decimal representation of the given hexadecimal string.
 *
 * @example
 *   hexToDecimal('5b:6a:f6:f4');  // returns 4109789787
 */
function hexToDecimal(hexString) {
  // Remove the colons
  var cleanedHex = hexString.replace(/:/g, '');

  // Split the string into bytes and reverse the order
  var bytes = [];
  for (var i = 0; i < cleanedHex.length; i += 2) {
    bytes.push(cleanedHex.substring(i, i + 2));
  }
  var reversedHex = bytes.reverse().join('');

  // Convert the reversed hexadecimal string to a decimal number
  var decimalValue = parseInt(reversedHex, 16);
  return decimalValue + "";
}
module.exports = hexToDecimal;