"use strict";

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var salutations = ['mr',
// Mister
'mrs',
// Mistress
'miss',
// Miss
'ms',
// Ms. (used when marital status is unknown or irrelevant)
'dr',
// Doctor (could be medical or academic)
'prof',
// Professor
// 'rev',     // Reverend (used for Christian clergy) disable because it has middle name has rev
'fr',
// Father (used for Catholic priests)
'atty',
// Attorney (used for lawyers)
'engr',
// Engineer
'arch',
// Architect
'judge',
// Judge
'honorable',
// Honorable (used before names of judges or other dignitaries)
'hon',
// Short for Honorable
'br',
// Brother (used for members of some religious orders)
'pr',
// Pastor (used for Protestant clergy)
'mx' // Mx. (gender-neutral honorific)
];
var suffixes = ['jr',
// Junior
'sr',
// Senior
'ii',
// The Second
'iii',
// The Third
'iv',
// The Fourth
'vi',
// The Sixth
'vii',
// The Seventh
'viii',
// The Eighth
'ix',
// The Ninth
'phd',
// Doctor of Philosophy
'md',
// Medical Doctor
'rn',
// Registered Nurse
'esq',
// Esquire (used for attorneys in some English-speaking countries)
'dmd',
// Doctor of Dental Medicine
'cme',
// Continuing Medical Education (not typically a suffix, but I've included it based on your original list)
'qc',
// Queen's Counsel (used for senior barristers in the UK and other Commonwealth countries)
'kc' // King's Counsel (historical equivalent of QC)
];
var dotRegex = /\./g;
var whitespaceRegex = /\s+/;

// Compound Name Particles
var compounds = [
// Germanic origin
'von', 'van', 'vere',
// Latin origin
'de', 'del', 'dela', 'della', 'di', 'da', 'des',
// Dutch origin
'vanden', 'zum', 'zur',
// Spanish & Portuguese origin
'delos', 'dos', 'das', 'y', 'o',
// Arabic origin
'bin', 'ibn', 'el', 'al',
// Italian origin
'pietro', 'la', 'lo', 'e',
// Other
'st.', 'st', 'ter', 'te', 'ten', 'op', 'ben', 'zu', 'im', 'un', 'une', 'le', 'mac', 'mc', 'ap', 'af', 'vel', 'd', 'of', 'am', 'auf', 'in', 'der', 'den'];
function spliceAtIndex(parts, index) {
  if (index > -1) {
    var _parts$splice = parts.splice(index, 1),
      _parts$splice2 = _slicedToArray(_parts$splice, 1),
      splicedElement = _parts$splice2[0];
    return splicedElement.replace(dotRegex, '');
  }
  return '';
}
function findAndAssignKey(parts, result, components, key) {
  if (!result[key]) {
    // Prevents overwriting an existing key
    var i = findIndex(parts, components);
    if (i > -1) {
      result[key] = spliceAtIndex(parts, i);
    }
  }
}
function handleSalutationAndSuffix(parts, result) {
  findAndAssignKey(parts, result, salutations, 'salutation');
  findAndAssignKey(parts, result, suffixes, 'suffix');
}
function handleCompound(parts, compounds) {
  var accumulator = []; // parent array
  var current = []; // child array
  // Merge compound parts
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    var len = parts.length;
    var isLast = i === len - 1;
    // if current part is compound
    if (compounds.includes(part.toLowerCase())) {
      // if current has value push to accumulator
      if (current.length > 0) {
        accumulator.push(current);
      }
      // create new current with the compound part
      current = [part];
    } else {
      // add every part to the current if not compound
      current.push(part);
    }
    // If this is the last part, finalize the current name
    if (isLast && current.length > 0) {
      accumulator.push(current);
    }
  }
  // Join all parts
  parts = accumulator.map(function (accumulator) {
    return accumulator.join(' ');
  });
  // if no compound split again
  if (parts.length === 1) {
    parts = parts[0].split(whitespaceRegex);
  }
  return parts;
}
function findIndex(parts, variables) {
  return parts.findIndex(function (part) {
    return variables.includes(part.toLowerCase().replace(dotRegex, ''));
  });
}
function handleMiddleInitial(parts, result) {
  var i = parts.findIndex(function (part) {
    return /^[A-Z]\.$/i.test(part);
  });
  if (i !== -1) result.middleName = parts.splice(i, 1)[0];
}

// Function to handle the "FirstName MiddleName LastName" format
function handleFirstNameFirst(name, result) {
  var parts = name.split(whitespaceRegex);
  handleSalutationAndSuffix(parts, result);
  handleMiddleInitial(parts, result);

  // separate name has compounds
  parts = handleCompound(parts, compounds);

  // If only two parts, the last part is the last name
  // The first part is need to split again
  if (parts.length === 2) {
    result.lastName = parts.pop();
    parts = parts[0].split(whitespaceRegex);
  }
  if (parts.length > 2) {
    if (!result.lastName) {
      result.lastName = parts.pop();
    }
    if (!result.middleName) {
      result.middleName = parts.pop();
    }
  }
  // The remaining parts are the first name
  result.firstName = parts.join(' ');
}
function lastNameFirst(name, result) {
  var parts = name.split(whitespaceRegex);
  handleSalutationAndSuffix(parts, result);
  handleMiddleInitial(parts, result);
  parts = handleCompound(parts, compounds);
  if (parts.length === 1) {
    result.firstName = parts[0];
  } else {
    result.middleName = parts.pop();
    result.firstName = parts.join(' ');
  }
}

// Function to handle the "LastName, FirstName MiddleName" format
function handleLastNameFirst(name, result) {
  var parts = name.split(',').reduce(function (acc, cur) {
    if (cur) {
      acc.push(cur.trim());
    }
    return acc;
  }, []);
  var lastNameParts = parts[0].split(whitespaceRegex);
  // check suffix in lastname
  findAndAssignKey(lastNameParts, result, suffixes, 'suffix');
  result.lastName = lastNameParts.join(' ');
  parts = parts[1].split(whitespaceRegex);
  handleSalutationAndSuffix(parts, result);
  parts = handleCompound(parts, compounds);
  if (parts.length === 1) {
    result.firstName = parts[0];
  } else {
    result.middleName = parts.pop();
    result.firstName = parts.join(' ');
  }
}
function parseName(name) {
  // default value
  var result = {
    firstName: "",
    middleName: "",
    lastName: "",
    salutation: "",
    suffix: ""
  };
  if (!name) {
    // Handle null value, e.g., return default object or throw an error
    return {
      firstName: "",
      middleName: "",
      lastName: "",
      salutation: "",
      suffix: ""
    };
  }
  // Initial cleaning of the name string.
  name = name.trim(); // remove extra space at start and end

  if (name.includes(',')) {
    handleLastNameFirst(name, result);
  } else {
    handleFirstNameFirst(name, result);
  }
  return result;
}
module.exports = parseName;