const getRestController = require('../controllers');

class User {
    constructor() {
        this.rest = getRestController()
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
                // return response;
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

    getCurrentUser() {
        return this.rest.request('GET', '/me');
    }

    static signIn(user) {
        const _user = new this();
        return _user.signIn(user);
    }

    static getCurrentUser() {
        const user = new this();
        return user.getCurrentUser();
    }
}

module.exports = User;
