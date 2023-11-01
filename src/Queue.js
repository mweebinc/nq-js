// classes
const Schema = require('./domain/Schema');
const Document = require('./domain/Document');
const User = require('./domain/User');
const File = require('./domain/File');
const Email = require('./domain/Email');
const Payment = require('./domain/Payment');
const Rest = require('./domain/Rest');
const Config = require('./Config');
const LiveQuery = require('./livequery/LiveQuery');
// functions
const blobToDataUrl = require('./blobToDataUrl');
const canvasToBlob = require('./canvasToBlob');
const imageResize = require('./imageResize');
const createPromise = require('./createPromise');
const urlToImage = require('./urlToImage');
const flatten = require('./flatten');
const unflatten = require('./unflatten');
const browseFile = require('./browseFile');
const parseName = require('./parseName');

/**
 * This class expose the functionality of this library
 */
class Queue {
    static setUrl(value) {
        Config.set('SERVER_URL', value);
    }

    static setApplicationId(value) {
        Config.set('APPLICATION_ID', value);
    }
}

// classes
Queue.User = User;
Queue.Schema = Schema;
Queue.Document = Document;
Queue.LiveQuery = LiveQuery;
Queue.File = File;
Queue.Email = Email;
Queue.Rest = Rest;
Queue.Payment = Payment;
// functions
Queue.blobToDataUrl = blobToDataUrl;
Queue.canvasToBlob = canvasToBlob;
Queue.imageResize = imageResize;
Queue.createPromise = createPromise;
Queue.urlToImage = urlToImage;
Queue.flatten = flatten;
Queue.unflatten = unflatten;
Queue.browseFile = browseFile;
Queue.parseName = parseName;
Queue.parse = require('./parse');

module.exports = Queue;
