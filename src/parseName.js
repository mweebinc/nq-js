// Function to find the difference between two arrays.
function diff(a1, a2) {
    // Concatenate the two arrays, then filter out only those items that appear once in the combined array
    return a1.concat(a2).filter((val, index, arr) => {
        return arr.indexOf(val) === arr.lastIndexOf(val);
    });
}

// Function to check if a word is a suffix
function isSuffix(word, suffixes) {
    return suffixes.indexOf(word.toLowerCase().replace(dotRegex, '')) > -1;
}

// Function to generate the full name
function generateFullName(attrs) {
    const nameWords = [];
    if (attrs.firstName) nameWords.push(attrs.firstName);
    if (attrs.middleName) nameWords.push(attrs.middleName);
    nameWords.push(attrs.lastName);
    if (attrs.suffix) nameWords.push(attrs.suffix);
    return nameWords.join(' ').trim();
}

function handleLastNameFirstFormat(parts, attrs, suffixes) {
    // Handling for "Last name, First name" format.
    let firstNameIndex;// Initialize a variable to keep track of the index where the first name starts in the 'parts' array.
    const lastName = parts.reduce((lastName, current, index) => {
        if (!Array.isArray(lastName)) {
            return lastName;
        }
        if (current.indexOf(',') === -1) {
            lastName.push(current);
            return lastName;
        } else {
            current = current.replace(',', '');
            if (suffixes.indexOf(current.toLowerCase().replace(dotRegex, '')) > -1) {
                attrs.suffix = current;
            } else {
                lastName.push(current);
            }
            firstNameIndex = index + 1;
            return lastName.join(' ');
        }
    }, []);
    // Use reduce to iterate through each part and build the last name.
    attrs.lastName = lastName;
    const remainingParts = parts.slice(firstNameIndex);
    if (remainingParts.length > 1) {
        attrs.firstName = remainingParts.shift();
        attrs.middleName = remainingParts.join(' ');
    } else if (remainingParts.length) {
        attrs.firstName = remainingParts[0];
    }
    attrs.fullName = generateFullName(attrs);
}

function handleFirstNameLastFormat(parts, attrs, salutations, compound, name) {
    if (parts.length > 1 && salutations.indexOf(parts[0].toLowerCase().replace(dotRegex, '')) > -1) {
        attrs.salutation = parts.shift();
        if (parts.length === 1) {
            attrs.lastName = parts.shift();
        } else {
            attrs.firstName = parts.shift();
        }
    } else {
        attrs.firstName = parts.shift();
    }
    if (!attrs.lastName) {
        attrs.lastName = parts.length ? parts.pop() : '';
    }
    const revParts = parts.slice(0).reverse();
    const compoundParts = [];
    revParts.every(part => {
        const test = part.toLowerCase().replace(dotRegex, '');
        if (compound.indexOf(test) > -1) {
            compoundParts.push(part);
            return true;
        }
        return false;
    });
    if (compoundParts.length) {
        attrs.lastName = compoundParts.reverse().join(' ') + ' ' + attrs.lastName;
        parts = diff(parts, compoundParts);
    }
    if (parts.length) {
        attrs.middleName = parts.join(' ');
    }
    if (attrs.lastName) {
        attrs.lastName = attrs.lastName.replace(',', '');
    }
    attrs.fullName = name;
}

// separate names into array
function separateComponents(nameStr) {
    // Match against the 'separateRegex' regular expression, or if that fails, split by whitespace
    let parts = (nameStr.match(separateRegex) || nameStr.split(whitespaceRegex));
    // If a part is enclosed in quotes, remove the quotes
    parts = parts.map(n => n.match(enclosedInQuotesRegex) ? n.slice(1, -1) : n);
    return parts;
}

// Regular expression for matching dots (periods)
const dotRegex = /\./g;
const commaSeparatedRegex = /\b,\b/;
const separateRegex = /[^\s"]+|"[^"]+"/g;
const extraSpaceBeforeCommaRegex = /\s+(?=,)/g;
const enclosedInQuotesRegex = /^".*"$/;
const whitespaceRegex = /\s+/;

function parseName(name) {
    // Define lists for salutations, suffixes, and compound parts of names.
    const salutations = ['mr', 'master', 'mister', 'mrs', 'miss', 'ms', 'dr', 'prof', 'rev', 'fr', 'judge', 'honorable', 'hon', 'tuan', 'sr', 'srta', 'br', 'pr', 'mx', 'sra'];
    const suffixes = ['i', 'ii', 'iii', 'iv', 'v', 'senior', 'junior', 'jr', 'sr', 'phd', 'apr', 'rph', 'pe', 'md', 'ma', 'dmd', 'cme', 'qc', 'kc'];
    const compound = ['delos', 'vere', 'von', 'van', 'de', 'del', 'della', 'der', 'den', 'di', 'da', 'pietro', 'vanden', 'du', 'st.', 'st', 'la', 'lo', 'ter', 'bin', 'ibn', 'te', 'ten', 'op', 'ben', 'al'];
    // Initial cleaning of the name string.
    let parts = name
        .trim()// remove extra space at start and end
        .replace(extraSpaceBeforeCommaRegex, '') // Remove extra spaces before commas.
        .replace(commaSeparatedRegex, ', ')  // Add space after commas, if missing.
    // Separate the name into its components.
    parts = separateComponents(parts);
    // Initialize an object to hold the parsed attributes.
    const attrs = {};
    // If no parts, return an empty object.
    if (!parts.length) {
        return attrs;
    }
    // If there's only one part, it's the first name.
    if (parts.length === 1) {
        attrs.firstName = parts[0];
    }
    //handle suffix first always, remove trailing comma if there is one
    if (isSuffix(parts[parts.length - 1], suffixes)) {
        attrs.suffix = parts.pop(); // remove and return the last element
        parts[parts.length - 1] = parts[parts.length - 1].replace(',', '');
    }
    //look for a comma to know we have last name first format
    // Determine if the name is in "First name Last name" or "Last name, First name" format.
    const firstNameFirstFormat = parts.every(part => {
        return part.indexOf(',') === -1;
    });

    if (!firstNameFirstFormat) {
        handleLastNameFirstFormat(parts, attrs, suffixes);
    } else {
        handleFirstNameLastFormat(parts, attrs, salutations, compound, name);
    }

    // Trim each attribute before returning.
    for (const [k, v] of Object.entries(attrs)) {
        attrs[k] = v.trim()
    }
    return attrs;
}

parseName.diff = diff;
parseName.generateFullName = generateFullName;
parseName.handleLastNameFirstFormat = handleLastNameFirstFormat;
parseName.handleFirstNameLastFormat = handleFirstNameLastFormat;
parseName.isSuffix = isSuffix;
parseName.separateComponents = separateComponents;
module.exports = parseName;

