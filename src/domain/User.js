const getRestController = require('../controllers');

class User {
    constructor() {
        this.rest = getRestController()
    }
    testFunction(){
        console.log('test from user');
    }

    signout(){
        return this.rest.request('POST', '/signout')
            .then(response => {
                this.rest.clearSession();
                return response;
            })
            .catch(() => {
                this.rest.clearSession();
            })
    }
    get(){
        return this.rest.request('GET', '/me')
            .catch((error) => {
                this.rest.clearSession();
                return error;
            })
    }
    signup(user){
        const options = {
            body : user
        }
        return this.rest.request('POST', '/signup', options)
    }
    signin(user){
        const options = {
            body : user
        }

        return this.rest.request('POST', '/signin', options)
            .then(response => {
                this.rest.setSession(response.sessionToken)
                console.log('then signin')
                return response;
            })
    }
    resetPassword(user) {
        const options = {
            body : {
                email : user.email
            }
        }
        return this.rest.request('POST', '/reset/', options);
    }
}
module.exports = User;