const RestController = require('./RestController')
const getRestAdapter = require('../adapters/rest')
const GetMemoryAdapter = require('../adapters/cache/memory');
const getXhrAdapter = require('../adapters/rest/xhr/index')
const UserCache = require('../data/user/source/UserCache')

const  GetLocalStorageAdapter =  require('../adapters/cache/local/LocalStorageAdapter')

//localStorage
const localStorageAdapter = new GetLocalStorageAdapter(NaN);

// const memoryAdapter = new GetMemoryAdapter(NaN); <-- memory
const userCache = new UserCache(localStorageAdapter);

function getRestController(){
    // const restAdapter = getRestAdapter();
    const xhrAdapter =  getXhrAdapter();
    return new RestController(xhrAdapter, userCache);
}

module.exports = getRestController