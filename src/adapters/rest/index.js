const HttpRestAdapter = require('./HttpRestAdapter');
const GetMemoryAdapter = require('../cache/memory/index')
const UserCache = require('../../data/user/source/UserCache')
const http = require('http');

const memoryAdapter = new GetMemoryAdapter(NaN)
const userCache = new UserCache(memoryAdapter)

function getHttpRestAdapter(){
    return new HttpRestAdapter(http, userCache);
}

module.exports = getHttpRestAdapter;