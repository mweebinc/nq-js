function checkIfCondition(condition, object) {
    if (condition.not) {
        return !checkIfCondition(condition.not, object);
    }
    return Object.keys(condition).every(field => object[field] === condition[field]);
}

function checkConditions(conditions, object, operator) {
    const method = operator === 'and' ? 'every' : 'some';
    return conditions[method](cond => checkCondition(cond, object));
}

function checkCondition(options, object) {
    if (options.if) {
        return checkIfCondition(options.if, object);
    }
    if (options.or) {
        return checkConditions(options.or, object, 'or');
    }
    if (options.and) {
        return checkConditions(options.and, object, 'and');
    }
    return false;
}

module.exports = checkCondition;
