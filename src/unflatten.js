function unflatten(object) {
    const result = {};
    Object.entries(object)
        .forEach(([path, value]) => {
            // traversal algorithm
            const keys = path.split('.');
            let current = result;
            for (let i = 0; i < keys.length - 1; i++) {
                const path = keys[i];
                current[path] = current[path] || {};
                current = current[path];
            }
            current[keys[keys.length - 1]] = value;
        });
    return result;
}

module.exports = unflatten;