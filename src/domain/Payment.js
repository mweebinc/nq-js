const defaultOptions = {
    merchantId: '0000002109222823C71D',
    merchantKey: 'AC2FC9F1D744E31E3D7BB00B90E269B7',
    currency: "PHP",
    endpoint: 'https://payin.payserv.net/paygate/',
    username: 'mrcntlinsrnc',
    password: '2fq25Yt8NaGK',
}
class Payment{
    constructor(options) {
        this.options = Object.assign(defaultOptions, options);
    }
    _getTransactionSignature(data) {
        const request_id = data.transaction.request_id;
        const notification_url = data.transaction.notification_url ? data.transaction.notification_url : '';
        const response_url = data.transaction.response_url ? data.transaction.response_url : '';
        const cancel_url = data.transaction.cancel_url ? data.transaction.cancel_url : '';
        const pmethod = data.transaction.pmethod ? data.transaction.pmethod : '';
        const payment_action = data.transaction.payment_action ? data.transaction.payment_action : '';
        const schedule = data.transaction.schedule ? data.transaction.schedule : '';
        const collection_method = data.transaction.collection_method ? data.transaction.collection_method : '';
        const deferred_period = data.transaction.deferred_period ? data.transaction.deferred_period : '';
        const deferred_time = data.transaction.deferred_time ? data.transaction.deferred_time : '';
        const dp_balance_info = data.transaction.dp_balance_info ? data.transaction.dp_balance_info : '';
        const amount = data.transaction.amount ? data.transaction.amount : '';
        const currency = data.transaction.currency ? data.transaction.currency : '';
        const descriptor_note = data.transaction.descriptor_note ? data.transaction.descriptor_note : '';
        const payment_notification_status = data.transaction.payment_notification_status ? data.transaction.payment_notification_status : '';
        const payment_notification_channel = data.transaction.payment_notification_channel ? data.transaction.payment_notification_channel : '';
        const raw = this.options.merchantId +
            request_id +
            notification_url +
            response_url + cancel_url +
            pmethod +
            payment_action +
            schedule +
            collection_method +
            deferred_period +
            deferred_time +
            dp_balance_info +
            amount +
            currency +
            descriptor_note +
            payment_notification_status +
            payment_notification_channel +
            this.options.merchantKey;
        return crypto.createHash('sha512').update(raw).digest('hex');
    }

    _getCustomerSignature(data) {
        const fname = data.customer_info.fname ? data.customer_info.fname : '';
        const lname = data.customer_info.lname ? data.customer_info.lname : '';
        const mname = data.customer_info.mname ? data.customer_info.mname : '';
        const email = data.customer_info.email ? data.customer_info.email : '';
        const phone = data.customer_info.phone ? data.customer_info.phone : '';
        const mobile = data.customer_info.mobile ? data.customer_info.mobile : '';
        const dob = data.customer_info.dob ? data.customer_info.dob : '';
        const raw = fname + lname + mname + email + phone + mobile + dob + this.options.merchantKey;
        return crypto.createHash('sha512').update(raw).digest('hex');
    }

    makePayment(transaction) {
        const data = {
            "transaction": {
                "request_id": transaction.id,
                "notification_url": transaction.acceptWebHook,
                "response_url": transaction.successRedirect,
                "cancel_url": transaction.cancelRedirect,
                "pmethod": transaction.method,
                "pchannel": transaction.channel,
                "payment_action": "url_link",
                "collection_method": "single_pay",
                "payment_notification_status": "1",
                "payment_notification_channel": "1",
                "amount": transaction.amount,
                "currency": transaction.currency || this.options.currency,
                "trx_type": "sale",
            },
            "customer_info": {
                "fname": transaction.firstName,
                "lname": transaction.lastName,
                "mname": transaction.middleName,
                "email": transaction.email,
                "phone": transaction.phoneNumber,
                "mobile": transaction.mobileNumber,
                "dob": "",
            },
            "order_details": {
                "orders": [
                    {
                        "itemname": "TEST 01",
                        "quantity": 1,
                        "unitprice": "100.00",
                        "totalprice": "100.00"
                    }
                ],
                "subtotalprice": "100.00",
                "shippingprice": "0.00",
                "discountamount": "0.00",
                "totalorderamount": "100.00"
            }
        };
        data.transaction.signature = this._getTransactionSignature(data);
        data.customer_info.signature = this._getCustomerSignature(data);
        const path = 'transactions/';
        return this._request({
            method: 'POST',
            path: path,
            body: data
        })
            .then(result => {
                return {
                    redirect: result.payment_action_info
                };
            });
    }
}
module.exports = Payment;