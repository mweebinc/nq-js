module.exports = Object.freeze({
    name: 'roles',
    fields: {
        name: {type: 'String', unique: true},
        users: {type: 'Relation', target: 'users'},
        roles: {type: 'Relation', target: 'roles'},
    },
    permissions: {
        find: ['*'],
        get: ['*'],
    }
});