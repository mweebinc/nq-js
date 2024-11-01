const getRestController = require('../controllers/rest');

class User {
    constructor() {
        this.rest = getRestController()
    }

    signUp(user, options = {}) {
        const _options = {
            body: user,
            timeout: options.timeout,
            masterKey: options.masterKey,
        }
        return this.rest.request('POST', '/signup', _options)
    }

    signIn(user, options = {}) {
        const _options = {
            body: user,
            timeout: options.timeout,
            masterKey: options.masterKey,
        }
        return this.rest.request('POST', '/signin', _options)
            .then(response => {
                this.rest.setSession(response.sessionToken);
                return response;
            });
    }

    getCurrentUser(options = {}) {
        const _options = {
            timeout: options.timeout,
            session: options.session,
            masterKey: options.masterKey,
        }
        return this.rest.request('GET', '/me', _options);
    }

    signOut(options = {}) {
        const _options = {
            timeout: options.timeout,
            session: options.session
        }
        return this.rest.request('POST', '/signout')
            .then(response => {
                this.rest.clearSession();
                return response;
            })
            .catch(() => {
                this.rest.clearSession();
            })
    }

    resetPassword(email, options) {
        const _options = {
            body: {
                email: email,
                timeout: options.timeout,
                session: options.session,
                masterKey: options.masterKey
            }
        }
        return this.rest.request('POST', '/reset/', _options);
    }

}

module.exports = User;
