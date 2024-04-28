/**
 * Given a source object and a string path, get the value from the source object.
 * If the path is not found, return undefined.
 * @param {Object} source - The source object.
 * @param {string} pathStr - The string path (e.g., "object.key.subKey").
 * @returns {*} - The value found at the given path or undefined if path is not found.
 */
function getValueFromPath(source, pathStr) {
    const path = pathStr.split('.');
    let current = source;
    for (const p of path) {
        if (current[p] === undefined) {
            return undefined;
        }
        current = current[p];
    }
    return current;
}

/**
 * Extracts all matches from a template string based on a regex pattern.
 * @param {string} template - The template string.
 * @param {RegExp} regex - The regular expression to match.
 * @returns {Array} - An array of matches.
 */
function extractMatches(template, regex) {
    let matches = [];
    let match;
    while ((match = regex.exec(template)) !== null) {
        matches.push(match);
    }
    return matches;
}

/**
 * Replaces all placeholders in a template string with their corresponding values from a source object.
 * @param {string} template - The template string.
 * @param {Object} source - The source object.
 * @returns {string|*} - The string with all placeholders replaced.
 */
function replace(template, source) {
    const regex = /\${(.*?)\}/g;
    const matches = extractMatches(template, regex);

    // Check if there is only one match and it encompasses the entire string
    if (matches.length === 1 && matches[0][0] === template) {
        const value = getValueFromPath(source, matches[0][1]);
        if (Array.isArray(value)) {
            return value; // Return the array directly
        }
        if (value === undefined) {
            return '';
        }
        return value;
    }
    // General case for multiple matches
    let result = template;
    for (const match of matches) {
        const value = getValueFromPath(source, match[1]);
        result = result.replace(match[0], value !== undefined ? value : '');
    }
    return result;
}
/**
 * Parses a value (can be an array, object, or string) and replaces all placeholders with their corresponding values from a source object.
 * @param {*} value - The template to parse.
 * @param {Object} source - The source object.
 * @returns {*} - The parsed value.
 */
function parse(value, source) {
    // Handle arrays
    if (Array.isArray(value)) {
        return value.reduce((acc, cur) => {
            const item = parse(cur, source);
            if (item) {
                acc.push(parse(cur, source));
            }
            return acc;
        }, []);
    }
    // Handle objects
    if (typeof value === 'object' && value !== null) {
        return Object.keys(value).reduce((acc, key) => {
            acc[key] = parse(value[key], source);
            return acc;
        }, {});
    }
    // Handle strings
    if (typeof value === 'string') {
        // Use the replaced value if it's not null or undefined; otherwise, use the original value
        const item = replace(value, source) ?? value;
        const whitespaceRegex = /^\s*$/;
        if (typeof item === "string" && item.match(whitespaceRegex)) {
            return '';
        }
        return item;
    }
    // Return the value as is if it's not an array, object, or string
    return value;
}
module.exports = parse;
