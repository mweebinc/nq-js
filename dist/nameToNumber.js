"use strict";

function nameToNumber(name) {
  return name.toLowerCase().replace(/ñ/g, 'n') // Replace ñ with n
  .replace(/[^a-z]/g, '') // Remove special characters
  .split('').reduce(function (acc, _char, index) {
    return acc + (_char.charCodeAt(0) - 96) * (index + 1);
  }, 0);
}
module.exports = nameToNumber;