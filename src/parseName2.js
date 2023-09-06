// Function to return elements that are unique to each input array
function getUniqueElements(a1, a2) {
    // Combine both arrays and filter out elements that appear more than once
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
    // check if has salutations like Mr. or Mrs.
    if (parts.length > 1 && salutations.indexOf(parts[0].toLowerCase().replace(dotRegex, '')) > -1) {
        attrs.salutation = parts.shift(); // store to the salutation and remove
        // If only one part remains after removing the salutation, it is assumed to be the last name.
        // Otherwise, the next part is assumed to be the first name.
        if (parts.length === 1) {
            attrs.lastName = parts.shift();
        } else {
            attrs.firstName = parts.shift();
        }
    } else {
        // if the parts is only 1 it first name
        attrs.firstName = parts.shift();
    }
    //  If attrs.lastName has not been set, it takes the last element of parts as the last name.
    if (!attrs.lastName) {
        attrs.lastName = parts.length ? parts.pop() : '';
    }
    // reverses parts
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
        parts = getUniqueElements(parts, compoundParts);
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

// return true if has comma in the elements
function hasComma(parts) {
    return parts.some(part => {
        return part.indexOf(',') !== -1;
    });
}

function parseName(name) {
    // Define lists for salutations, suffixes, and compound parts of names.
    const salutations = ['mr', 'master', 'mister', 'mrs', 'miss', 'ms', 'dr', 'prof', 'rev', 'fr', 'judge', 'honorable', 'hon', 'tuan', 'sr', 'srta', 'br', 'pr', 'mx', 'sra'];
    const suffixes = ['i', 'ii', 'iii', 'iv', 'v', 'senior', 'junior', 'jr', 'sr', 'phd', 'apr', 'rph', 'pe', 'md', 'ma', 'dmd', 'cme', 'qc', 'kc'];
    // Compound Name Particles
    const compound = [
        // Germanic origin
        'von', 'van', 'vere',
        // Latin origin
        'de', 'del', 'della', 'di', 'da', 'des',
        // Dutch origin
        'vanden', 'zum', 'zur',
        // Spanish & Portuguese origin
        'dos', 'das', 'y', 'o',
        // Arabic origin
        'bin', 'ibn', 'el', 'al',
        // Italian origin
        'pietro', 'la', 'lo', 'e',
        // Other
        'st.', 'st', 'ter', 'te', 'ten', 'op', 'ben', 'zu', 'im', 'un', 'une', 'le',
        'mac', 'mc', 'ap', 'af', 'vel', 'd', 'of', 'am', 'auf', 'in', 'delos', 'der', 'den'
    ];
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
    // look for a comma to know we have last name first format
    // Determine if the name is in "First name Last name" or "Last name, First name" format.
    const lastNameFirstFormat = hasComma(parts);
    if (lastNameFirstFormat) {
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

parseName.getUniqueElements = getUniqueElements;
parseName.generateFullName = generateFullName;
parseName.handleLastNameFirstFormat = handleLastNameFirstFormat;
parseName.handleFirstNameLastFormat = handleFirstNameLastFormat;
parseName.isSuffix = isSuffix;
parseName.separateComponents = separateComponents;
module.exports = parseName;

