const salutations = ['mr', 'master', 'mister', 'mrs', 'miss', 'ms', 'dr', 'prof', 'rev', 'fr', 'judge', 'honorable', 'hon', 'tuan', 'sr', 'srta', 'br', 'pr', 'mx', 'sra'];
const suffixes = ['i', 'ii', 'iii', 'iv', 'v', 'senior', 'junior', 'jr', 'sr', 'phd', 'apr', 'rph', 'pe', 'md', 'ma', 'dmd', 'cme', 'qc', 'kc'];
const dotRegex = /\./g;
const whitespaceRegex = /\s+/;

// Compound Name Particles
const compound = [
    // Germanic origin
    'von', 'van', 'vere',
    // Latin origin
    'de', 'del', 'dela', 'della', 'di', 'da', 'des',
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

function spliceAtIndex(parts, index) {
    if (index > -1) {
        const [splicedElement] = parts.splice(index, 1);
        return splicedElement.replace(/\./g, '');
    }
    return '';
}

function handleName(parts, result) {
    const i = findIndex(parts, salutations);
    if (i > -1) {
        result.salutation = spliceAtIndex(parts, i);
    }
    const j = findIndex(parts, suffixes);
    if (j > -1) {
        result.suffix = spliceAtIndex(parts, j);
    }
}

function handleCompound(parts, compounds) {
    const accumulator = [];
    let current = [];
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const len = parts.length;
        const isLast = i === len - 1;
        // if part is a compound, add current to accumulator
        if (compounds.includes(part.toLowerCase())) {
            if (current.length > 0) {
                accumulator.push(current);
            }
            current = [part];
        } else {
            // add all part to the current
            current.push(part);
        }
        // If this is the last part, finalize the current name
        if (isLast && current.length > 0) {
            accumulator.push(current);
        }
    }
    return accumulator.map(accumulator => accumulator.join(' '));
}

// Function to check if a word is a suffix
function isSuffix(word, suffixes) {
    return suffixes.indexOf(word.toLowerCase().replace(dotRegex, '')) > -1;
}

function findIndex(parts, variables) {
    for (let i = 0; i < parts.length; i++) {
        const word = parts[i];
        if (variables.includes(word.toLowerCase().replace(dotRegex, ''))) return i;
    }
    return -1;
}

// Function to handle the "FirstName MiddleName LastName" format
function handleFirstNameFirst(name, result, compound) {
    let parts = name.split(whitespaceRegex);
    handleName(parts, result);
    // separate name has compound
    parts = handleCompound(parts, compound);
    // if no compound split again
    if (parts.length === 1) {
        parts = parts[0].split(whitespaceRegex);
    }

    // if the result only two
    if (parts.length === 2) {
        result.lastName = parts.pop();
        parts = parts[0].split(whitespaceRegex);
    }
    // if the parts only 1 it mean it first name
    if (parts.length === 1) {
        result.firstName = parts[0];
    }

    // if length is only 2 again
    if (parts.length === 2) {
        result.firstName = parts.shift();
        result.middleName = parts.shift();
    }
    if (parts.length === 3) {
        result.firstName = parts[0];
        result.middleName = parts[1];
        result.lastName = parts[2];
    }
    if (parts.length > 3) {
        result.lastName = parts.pop();
        result.middleName = parts.pop();
        result.firstName = parts.join(' ');
    }
}


// Function to handle the "LastName, FirstName MiddleName" format
function handleLastNameFirst(name, result, compound) {
    let parts = name.split(',').map(part => part.trim());
    const lastNameParts = parts[0].split(whitespaceRegex);
    // check suffix
    const k = findIndex(lastNameParts, suffixes);
    if (k > -1) {
        result.suffix = lastNameParts[k].replace(dotRegex, '');
        lastNameParts.splice(k, 1);  // Remove the suffix from parts
    }
    result.lastName = lastNameParts.join(' ');
    parts = parts[1].split(whitespaceRegex);
    handleName(parts, result);
    parts = handleCompound(parts, compound);
    if (parts.length === 1) {
        parts = parts[0].split(whitespaceRegex);
    }
    // only first name and middle name
    if (parts.length === 2) {
        result.firstName = parts[0];
        result.middleName = parts[1];
    }
}


function parseName(name) {
    // default value
    let result = {
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
    name = name
        .trim()// remove extra space at start and end

    if (name.includes(',')) {
        handleLastNameFirst(name, result, compound);
    } else {
        handleFirstNameFirst(name, result, compound);
    }
    return result;
}

parseName.isSuffix = isSuffix;
module.exports = parseName;
