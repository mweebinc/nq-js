const getController = require("../controllers/rest");

class Rest {
    constructor() {
        this.rest = getController();
    }

    request(method, path, options, session) {
        return this.rest.request(method, path, options, session)
    }
}

module.exports = Rest;