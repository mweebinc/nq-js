const getRestController = require('../controllers/rest');

class Payment {
    constructor() {
        this.rest = getRestController()
    }

    makePayment(transaction, session) {
         console.log('make payment use case');
        const path = '/paynamics/make';
        const options = {
            body: transaction
        }
        return this.rest.request('POST', path, options, session)
    }
    static makePayment(transaction) {
        const payment = new this();
        return payment.makePayment(transaction);
    }
}

module.exports = Payment;
