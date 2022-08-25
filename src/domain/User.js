const getRestController = require('../controllers/rest');

class User {
    constructor() {
        this.rest = getRestController()
    }

    signUp(user) {
        const options = {
            body: user
        }
        return this.rest.request('POST', '/signup', options)
    }
    signIn(user) {
        const options = {
            body: user
        }
        return this.rest.request('POST', '/signin', options)
            .then(response => {
                return this.rest.setSession(response.sessionToken)
            });
    }
    getCurrentUser() {
        return this.rest.request('GET', '/me');
    }
    signOut() {
        return this.rest.request('POST', '/signout')
            .then(response => {
                this.rest.clearSession();
                return response;
            })
            .catch(() => {
                this.rest.clearSession();
            })
    }
    resetPassword(user) {
        const options = {
            body: {
                email: user.email
            }
        }
        return this.rest.request('POST', '/reset/', options);
    }
    static signUp(user) {
        const _user = new this();
        return _user.signUp(user);
    }
    static signIn(user) {
        const _user = new this();
        return _user.signIn(user);
    }

    static getCurrentUser() {
        const user = new this();
        return user.getCurrentUser();
    }
    static signOut() {
        const user = new this();
        return user.signOut();
    }
    static resetPassword(user) {
        const _user = new this();
        return _user.resetPassword(user);
    }
}

module.exports = User;
