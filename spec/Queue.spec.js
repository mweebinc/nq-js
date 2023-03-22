// const fields = require('../src/domain/schema/default/fields')
// const permissions = require('../src/domain/schema/default/permissions')
// const Queue = require('../src/Queue');
// const Config = require('../src/Config');

//new tests
xdescribe('global config', function () {
    //defaults
    const appid = '6560588f36297abd70cb7433774d5e09';
    const masterKey = '43600a5f650ed69e3391ccdf271332d437f4026e';
    const url = 'http://localhost/v1';

    // Queue.setUrl(url);
    // Queue.setApplicationId(appid);

    xit('should get properties', function (done) {
        expect(Config.get('APPLICATION_ID')).toEqual(appid);
        expect(Config.get('MASTER_KEY')).toEqual(masterKey);
        expect(Config.get('SERVER_URL')).toEqual(url);
        done();
    })
});
xdescribe('Document', function () {
    xit('should add document', function (done) {
        const newDocument = {
            name: 'Laptop1',
            price: 13000
        }

        const document = new Queue.Document()
        document.create('products', newDocument)
            .then((response) => {
                console.log(response);
                done();
            })
            .catch(done.fail);
    });
    xit('should find a document by id', function (done) {
        const existingDocument = {
            id: 'T6KOGNK886',
            name: 'Pencil',
            price: 299,
            createdAt: '2022-06-07T01:30:32.862Z',
            updatedAt: '2022-06-07T01:30:32.862Z',
            acl: {read: ['*'], write: []}
        }

        const document = new Queue.Document();
        document.find('products', existingDocument.id)
            .then((response) => {
                for (let field in existingDocument) {
                    expect(existingDocument[field]).toEqual(response[field]);
                }
                done();
            })
            .catch(done.fail);
    });
    xit('should update document by id', function (done) {
        const newDocument = {
            id: 'RJO6BD61U9',
            //change name
            name: "Tumbler",
            price: 9999
        }
        const document = new Queue.Document();
        document.update('products', newDocument)
            .then((response) => {
                for (let field in newDocument) {
                    expect(newDocument[field]).toEqual(response[field]);
                }
                done();
            })
            .catch(done.fail);
    });
    xit('should delete a document by id', function (done) {
        const document = new Queue.Document();
        document.delete('products', 'IMJ74S86GY')
            .then((response) => {
                expect(response).toEqual({});
                done();
            })
            .catch(done.fail);
    });
    xit('should get all documents', function (done) {
        const document = new Queue.Document();
        document.findAll('products')
            .then((response) => {
                console.log(response);
                done();
            })
            .catch(done.fail);
    })
});
xdescribe('Collection', function () {
    xit('should create a new collection based on schema', function (done) {
        const newCollection = {
            name: 'chat-quick',
            fields: {
                department: {type: 'String'},
                message: {type: 'String'},
                severity: {type: 'Number'}
            }
        }
        const collection = new Queue.Collection();
        collection.create(newCollection)
            .then((response) => {
                //attach default fields and permissions
                const withDefaults = response.assign(newCollection, {
                    fields: {
                        ...newCollection.fields,
                        ...fields
                    },
                    permissions
                })
                for (let field in withDefaults) {
                    expect(withDefaults[field]).toEqual(response[field]);
                }
                /*for(let field in newCollection){
                    expect(newCollection[field]).toEqual(response[field]);
                }*/
                done();
            })
            .catch(done.fail)
    });
    xit('should update a schema', function (done) {
        const schema = {
            name: 'chat2',
            fields: {
                type: {type: 'String'}
            }
        }
        const collection = new Queue.Collection();
        collection.update(schema)
            .then((response) => {
                const withDefaults = response.assign(schema, {
                    fields: {
                        ...schema.fields,
                        ...fields
                    },
                    permissions
                })
                for (let field in withDefaults) {
                    expect(withDefaults[field]).toEqual(response[field]);
                }
                done();
            })
            .catch(done.fail);
    });
    xit('should find  a schema based on id', function (done) {
        const schema = {
            name: 'roles',
            fields: {
                ...fields,
                name: {type: 'String', unique: true},
                users: {type: 'Relation', target: 'users'},
                roles: {type: 'Relation', target: 'roles'}
            },
            permissions: {find: ['*'], get: ['*']}
        }

        const collection = new Queue.Collection();
        collection.find(schema.name)
            .then((response) => {
                for (let field in schema) {
                    expect(schema[field]).toEqual(response[field]);
                }
                done();
            })
            .catch(done.fail);
    });
    xit('should delete a schema based on name', function (done) {
        const collection = new Queue.Collection();
        collection.delete('chat45')
            .then((response) => {
                expect(response).toEqual({});
                done();
            })
            .catch(done.fail);
    });
    xit('should get all schemas', function (done) {
        const collection = new Queue.Collection();
        collection.findAll()
            .then((response) => {
                console.log(response);
                done();
            })
            .catch(done.fail);
    });
    xit('unauthorized without user or master-key', function (done) {
        const collection = new Queue.Collection();
        //set master to empty
        Config.set('X-Master-Key', '');
        collection.findAll()
            .then((response) => {
                console.log(response);
                expect()
                done();
            })
            .catch(done.fail);
    });
});
describe('Users', function () {
    xit('should signup a new user', function (done) {
        //create a new user, must be unique
        const newUser = {
            username: 'jygrzn@gmail.com',
            email: 'jygrzn@gmail.com',
            password: '123123123',
        }
        const user = new Queue.User();
        user.signup(newUser)
            .then((response) => {
                console.log(response);
                Object.assign(newUser, {
                    id: response.id,
                    createdAt: response.createdAt,
                    updatedAt: response.updatedAt,
                    acl: {
                        read: [response.id, '*'],
                        write: [response.id]
                    }
                })
                for (let field in newUser) {
                    if (field !== 'password') {
                        expect(newUser[field]).toEqual(response[field]);
                    }
                }
                done();
            })
            .catch(done.fail);
    });
    xit('should signin', function (done) {
        const registeredUser = {
            username: 'jaygilbert@1',
            password: 'jaygilbert@123'
        }
        const user = new Queue.User();
        user.signin(registeredUser)
            .then((response) => {
                expect(response.password).toBeUndefined();
                expect(response.id).toBeDefined();
                expect(response.username).toEqual(registeredUser.username);
                expect(response.createdAt).toBeDefined();
                expect(response.email).toEqual(user.email);
                expect(response.updatedAt).toBeDefined();
                expect(response.sessionToken).toBeDefined();
                done();
            })
            .catch(done.fail);
    });
    xit('should signin with email', function (done) {
        const registeredUser = {
            email: 'jygrzn@gmail.com',
            password: 'jaygilbert@123',
        }
        const user = new Queue.User();
        user.signin(registeredUser)
            .then((response) => {
                expect(response.password).toBeUndefined();
                done();
            })
            .catch(done.fail);
    });
    xit('should signin with master key', function (done) {
        const registeredUser = {
            username: 'jaygilbert@1',
            password: 'jaygilbert@123',
            masterKey: 'test'
        }
        const user = new Queue.User();
        user.signin(registeredUser)
            .then((response) => {
                expect(response.id).toBeDefined();
                expect(response.createdAt).toBeDefined();
                expect(response.email).toEqual(user.email);
                expect(response.updatedAt).toBeDefined();
                expect(response.username).toEqual(registeredUser.username);
                expect(response.password).toBeUndefined();
                expect(response.sessionToken).toBeDefined();
                done();
            })
            .catch(done.fail)

    });
    xit('should call /me', function (done) {
        const user = new Queue.User();
        user.get()
            .then(response => {
                console.log(response);
                done();
            })
            .catch(done.fail);
    })
    xit('should not call /me if no session', function (done) {
        const user = new Queue.User();
        user.get()
            .then((response) => {
                expect(response).toEqual({code: 209, message: 'Invalid session token'})
                done();
            })
            .catch(done.fail);
    })
    xit('should only allow unique username', function (done) {
        const existingUser = {
            username: 'jaygilbert@1',
            password: 'jaygilbert@123'
        }
        const user = new Queue.User();
        user.signup(existingUser)
            .then((response) => {
                expect(response).toEqual({code: 137, message: 'username should be unique.'});
                console.log(response);
                done();
            })
            .catch(done.fail);
    });
    xit('should not signin with invalid username', function (done) {
        const newUser = {
            username: 'jaygilbert@124',
            password: 'jaygilbert@123'
        }
        const user = new Queue.User();
        user.signin(newUser)
            .then((response) => {
                expect(response).toEqual({code: 101, message: 'Invalid username/password.'})
                done();
            })
            .catch(done.fail);
    });
    xit('should not signin with invalid password', function (done) {
        const newUser = {
            username: 'jaygilbert@1',
            password: 'jaygilbert@12345'
        }
        const user = new Queue.User();
        user.signin(newUser)
            .then((response) => {
                expect(response).toEqual({code: 101, message: 'Invalid username/password.'})
                done();
            })
            .catch(done.fail);
    });
    xit('should signout', function (done) {
        const user = new Queue.User();
        const registeredUser = {
            username: 'jaygilbert@1',
            password: 'jaygilbert@123'
        };
        user.signout()
            .then((response) => {
                expect(response).toEqual({})
                done();
            })
            .catch(done.fail);
    });
    xit('should reset user ', function (done) {
        const user = new Queue.User();
        const registeredUser = {
            email: 'jygrzn@gmail.com',
        }

        user.resetPassword(registeredUser)
            .then((response) => {
                expect(response).toEqual({});
                done();
            })
            .catch(done.fail)

    });
    xit('invalid session token', function (done) {
        const userQueue = new Queue.User();

        const user = {
            email: 'somenewemailyyy@gmail.com',
            username: 'somene@gmail.com',
            password: '123123123s'
        }
        userQueue.signin(user)
            .then(response => {
                // expect(response).toEqual({ code: 209, message: 'Invalid session token' })
                console.log(response)
                done();
            })
            .catch(done.fail)
    })
});