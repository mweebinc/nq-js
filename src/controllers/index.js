const RestController = require('./RestController')
const getRestAdapter = require('../adapters/rest')
const GetMemoryAdapter = require('../adapters/cache/memory');
const UserCache = require('../data/user/source/UserCache')

const memoryAdapter = new GetMemoryAdapter(NaN);
const userCache = new UserCache(memoryAdapter);

function getRestController(){
    const restAdapter = getRestAdapter();
    return new RestController(restAdapter, userCache);
}

module.exports = getRestController