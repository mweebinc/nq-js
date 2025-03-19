"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _papaparse = _interopRequireDefault(require("papaparse"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function csvToJson(file) {
  return new Promise(function (resolve) {
    _papaparse["default"].parse(file, {
      header: true,
      complete: function complete(result) {
        return resolve(result.data);
      }
    });
  });
}
var _default = exports["default"] = csvToJson;