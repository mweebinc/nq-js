const getRestController = require('../controllers/rest');

class Payment {
    constructor() {
        this.rest = getRestController()
    }

    makePayment(transaction, session) {
        const path = '/paynamics/make';
        const options = {
            body: {id : transaction.request_id}
        }
        return this.rest.request('POST', path, options, session)
    }
    static makePayment(transaction) {
        const payment = new this();
        return payment.makePayment(transaction);
    }
}

module.exports = Payment;
