const RestController = require('./RestController')
const getRestAdapter = require('../adapters/rest')
const GetMemoryAdapter = require('../adapters/cache/memory');
const getXhrAdapter = require('../adapters/rest/xhr/index')
const UserCache = require('../data/user/source/UserCache')

const  getCacheAdapter =  require('../adapters/cache/local')

//localStorage
const localStorageAdapter = getCacheAdapter(NaN);

 const memoryAdapter = new GetMemoryAdapter(NaN);
const userCache = new UserCache(memoryAdapter);

function getRestController(){
    if(typeof window !== 'undefined'){
        const xhrAdapter =  getXhrAdapter();
        const localCache = new UserCache(localStorageAdapter)
        return new RestController(xhrAdapter, localCache)

    }else{
        const restAdapter = getRestAdapter();
        // const xhrAdapter =  getXhrAdapter();
        return new RestController(restAdapter, userCache);
    }



}

module.exports = getRestController