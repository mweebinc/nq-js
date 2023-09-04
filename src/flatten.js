function flatArray(arr, values, prefix) {
    return arr.reduce((acc, cur) => {
        values.forEach(item => {
            if (typeof item === 'object') {
                const objs = flatten(item, prefix);
                objs.forEach(obj => {
                    acc.push({...cur, ...obj});
                });
                return;
            }
            const object = {};
            object[prefix.join('.')] = item;
            acc.push({...cur, ...object});
        });
        return acc;
    }, []);
}

function flatten(object, prefix = []) {
    return Object.entries(object)
        .reduce((acc, [key, value]) => {
            if (Array.isArray(value) && value.length) {
                return flatArray(acc, value, prefix.concat(key));
            }
            if (value !== null && typeof value === 'object') {
                acc[0] = {...acc[0], ...flatten(value, prefix.concat(key))[0]}
                return acc;
            }
            acc[0][prefix.concat(key).join('.')] = value;
            return acc;
        }, [{}]);
}

module.exports = flatten;
