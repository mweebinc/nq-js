function nameToNumber(name) {
    return name
        .toLowerCase()
        .replace(/ñ/g, 'n') // Replace ñ with n
        .replace(/[^a-z]/g, '') // Remove special characters
        .split('')
        .reduce((acc, char, index) => {
            return acc + (char.charCodeAt(0) - 96) * (index + 1);
        }, 0);
}

module.exports = nameToNumber;