const UserCache = require('./UserCache')
const memoryAdapter = require('../../../adapters/cache/memory/index')


function getUserCache(){
    return new UserCache(memoryAdapter(NaN))
}
module.exports = getUserCache