function unflatten(arr) {
    return arr.reduce((acc, cur) => {
        const result = {};
        Object.entries(cur)
            .forEach(([key, value]) => {
                const paths = key.split('.');
                // traversal algorithm
                let current = result;
                for (let i = 0; i < paths.length - 1; i++) {
                    const path = paths[i];
                    current[path] = current[path] || {};
                    current = current[path];
                }
                current[paths[paths.length - 1]] = value;
            });
        acc.push(result);
        return acc;
    }, []);
}

module.exports = unflatten;