const HttpRestAdapter = require('./HttpRestAdapter');
const http = require('http');

function getHttpRestAdapter() {
    return new HttpRestAdapter(http);
}

module.exports = getHttpRestAdapter;
