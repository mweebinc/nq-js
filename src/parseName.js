const salutations = [
    'mr',      // Mister
    'mrs',     // Mistress
    'miss',    // Miss
    'ms',      // Ms. (used when marital status is unknown or irrelevant)
    'dr',      // Doctor (could be medical or academic)
    'prof',    // Professor
    // 'rev',     // Reverend (used for Christian clergy) disable because it has middle name has rev
    'fr',      // Father (used for Catholic priests)
    'atty',    // Attorney (used for lawyers)
    'engr',    // Engineer
    'arch',    // Architect
    'judge',   // Judge
    'honorable', // Honorable (used before names of judges or other dignitaries)
    'hon',     // Short for Honorable
    'br',      // Brother (used for members of some religious orders)
    'pr',      // Pastor (used for Protestant clergy)
    'mx'       // Mx. (gender-neutral honorific)
];
const suffixes = [
    'jr',      // Junior
    'sr',      // Senior
    'ii',      // The Second
    'iii',     // The Third
    'iv',      // The Fourth
    'vi',      // The Sixth
    'vii',     // The Seventh
    'viii',    // The Eighth
    'ix',      // The Ninth
    'phd',     // Doctor of Philosophy
    'md',      // Medical Doctor
    'rn',      // Registered Nurse
    'esq',     // Esquire (used for attorneys in some English-speaking countries)
    'dmd',     // Doctor of Dental Medicine
    'cme',     // Continuing Medical Education (not typically a suffix, but I've included it based on your original list)
    'qc',      // Queen's Counsel (used for senior barristers in the UK and other Commonwealth countries)
    'kc'       // King's Counsel (historical equivalent of QC)
];
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
    'delos','dos', 'das', 'y', 'o',
    // Arabic origin
    'bin', 'ibn', 'el', 'al',
    // Italian origin
    'pietro', 'la', 'lo', 'e',
    // Other
    'st.', 'st', 'ter', 'te', 'ten', 'op', 'ben', 'zu', 'im', 'un', 'une', 'le',
    'mac', 'mc', 'ap', 'af', 'vel', 'd', 'of', 'am', 'auf', 'in',  'der', 'den'
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
    parts = accumulator.map(accumulator => accumulator.join(' '));
    // if no compound split again
    if (parts.length === 1) {
        parts = parts[0].split(whitespaceRegex);
    }
    return parts;
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
    // handle suffix and salutation
    handleName(parts, result);
    // separate name has compound
    parts = handleCompound(parts, compound);
    // if the result only two
    if (parts.length === 2) {
        result.lastName = parts.pop();
        parts = parts[0].split(whitespaceRegex);
    }
    if (parts.length > 2) {
        result.lastName = parts.pop();
        result.middleName = parts.pop();
    }
    result.firstName = parts.join(' ');
}


// Function to handle the "LastName, FirstName MiddleName" format
function handleLastNameFirst(name, result, compound) {
    let parts = name.split(',')
        .reduce((acc, cur) => {
            if (cur) {
                acc.push(cur.trim());
            }
            return acc;
        }, []);
    const lastNameParts = parts[0].split(whitespaceRegex);
    // check suffix in lastname
    const i = findIndex(lastNameParts, suffixes);
    if (i > -1) {
        result.suffix = lastNameParts[i].replace(dotRegex, '');
        lastNameParts.splice(i, 1);  // Remove the suffix from parts
    }
    result.lastName = lastNameParts.join(' ');
    parts = parts[1].split(whitespaceRegex);
    handleName(parts, result);
    parts = handleCompound(parts, compound);
    if (parts.length === 1) {
        result.firstName = parts[0];
    } else {
        result.middleName = parts.pop();
        result.firstName = parts.join(' ');
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

module.exports = parseName;
