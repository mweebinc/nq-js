module.exports = Object.freeze({
    id: {
        type: 'String',
        write: false,
        default: {
            __operation: 'random',
            __character: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '0123456789',
            __size: 10,
            __event: 'onSave'
        }
    },
    createdAt: {
        type: 'Date',
        write: false,
        default: {
            __operation: 'current.date',
            __event: 'onSave'
        }
    },
    updatedAt: {
        type: 'Date',
        write: false,
        read: false,
        default: {
            __operation: 'current.date',
        }
    },
    acl: {
        type: 'ACL',
        write: false,
        read: false,
        default: {
            read: ['current.user', '*'],
            write: ['current.user'],
            __event: 'onSave'
        }
    },
})
