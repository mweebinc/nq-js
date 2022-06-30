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
                this.rest.setSession(response.sessionToken)
                return response;
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

    get() {
        return this.rest.request('GET', '/me');
    }
}

module.exports = User;
