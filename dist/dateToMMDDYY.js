"use strict";

function dateToMMDDYY(isoDateString) {
  var date = new Date(isoDateString);
  var year = date.getFullYear().toString().slice(-2); // Get last 2 digits of the year
  var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed; add 1
  var day = date.getDate().toString().padStart(2, '0');
  return month + day + year;
}
module.exports = dateToMMDDYY;