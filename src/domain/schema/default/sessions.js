module.exports = Object.freeze({
    name: 'sessions',
    fields: {
        user: {
            type: 'Pointer',
            target: 'users'
        },
        token: {
            type: 'String',
            default: {
                __operation: 'random',
                __character: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789',
                __size: 32,
            }
        },
        expiresAt: {
            type: 'Date',
            write: false,
        },
        masterKey: {
            type: 'String',
            write: false,
            hidden: true,
        },
        acl: {
            type: 'ACL',
            write: false,
            read: false
        },
    },
    permissions: {
        find: ['*'],
        get: ['*'],
    }
});
