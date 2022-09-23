const getRestController = require('../controllers/rest');

class Email {
    constructor() {
        this.rest = getRestController()
    }

    verify(email, session) {
        const path = '/verify/';
        const options = {
            body: {email: email}
        }
        return this.rest.request('POST', path, options, session)
    }
    
    static verify(email, session) {
        const _ = new this();
        return _.verify(email, session);
    }

}

module.exports = Email;
