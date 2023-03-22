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
                this.rest.setSession(response.sessionToken);
                return response;
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

    resetPassword(email) {
        const options = {
            body: {
                email: email
            }
        }
        return this.rest.request('POST', '/reset/', options);
    }

}

module.exports = User;
