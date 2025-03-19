"use strict";

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function camelCase(str) {
  return str.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}
function transformStyle(value) {
  var styles = value.split(';').filter(function (s) {
    return s;
  });
  return styles.reduce(function (acc, cur) {
    var _cur$split = cur.split(':'),
      _cur$split2 = _slicedToArray(_cur$split, 2),
      key = _cur$split2[0],
      value = _cur$split2[1];
    acc[camelCase(key)] = value.trim();
    return acc;
  }, {});
}
function transformAttributes(attributes) {
  return Array.from(attributes).reduce(function (acc, _ref) {
    var name = _ref.name,
      value = _ref.value;
    // change html class to className
    if (name === 'class') {
      name = 'className';
    }
    if (name === 'style') {
      acc[name] = transformStyle(value);
      return acc;
    }
    acc[name] = value;
    return acc;
  }, {});
}
function transform(node) {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return undefined;
  }
  var object = {};
  object.type = node.nodeName.toLowerCase();
  object.props = node.attributes && transformAttributes(node.attributes);
  if (node.childNodes.length) {
    object.children = Array.from(node.childNodes).map(function (item) {
      if (item.nodeType === Node.TEXT_NODE) {
        return item.textContent;
      }
      return transform(item);
    });
  }
  return object;
}
function nodeToJson(node) {
  var nodes = Array.from(node.childNodes);
  return nodes.map(function (node) {
    return transform(node);
  }).filter(function (item) {
    return item;
  });
}
module.exports = nodeToJson;