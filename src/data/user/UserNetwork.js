class UserNetwork{
    constructor(rest) {
        this.rest = rest
    }

    signin(user){
        const options = {
            body : user
        }
        return this.rest.request('POST', '/signin', options)
    }
    signup(user){
        const options = {
            body : user
        }
        return this.rest.request('POST', '/signup', options)
    }
    signout(){
        return this.rest.request('POST', '/signout')
    }
    resetPassword(user){
        const options = {
            body : {
                email : user.email
            }
        }
        return this.rest.request('POST', '/reset/', options);
    }
    get(){
        return this.rest.request('GET', '/me')
    }
}
module.exports = UserNetwork