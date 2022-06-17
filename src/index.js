const Config = require('./Config');
const Queue = require('./Queue');

const InMemoryCache = require('../src/adapters/cache/memory/InMemoryCache')
const MemoryAdapter = require('../src/adapters/cache/memory/InMemoryCacheAdapter')
const GetMemoryAdapter = require('../src/adapters/cache/memory/index')
const userCache = require('../src/data/user/source/UserCache')
const RestAdapter = require('../src/adapters/rest/HttpRestAdapter')
const getRestAdapter = require('../src/adapters/rest/index')
const getRestController = require('../src/controllers/index');
const RestController = require('../src/controllers/RestController')
const User = require('./domain/User');
const Document = require('./domain/Document');
const Collection = require('./domain/Collection');

Queue.setUrl('http://localhost/v1');
Queue.setApplicationId('6560588f36297abd70cb7433774d5e09');

module.exports = {Queue, Config};






