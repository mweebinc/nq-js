const Schema = require('./domain/Schema');
const Document = require('./domain/Document');
const User = require('./domain/User');
const File = require('./domain/File');
const Email = require('./domain/Email');
const Payment = require('./domain/Payment')
const Config = require('./Config');
const LiveQuery = require('./livequery/LiveQuery');
//
const blobToDataUrl = require('./blobToDataUrl');
const canvasToBlob = require('./canvasToBlob');
const imageResize = require('./imageResize');
const createPromise = require('./createPromise');
const urlToImage = require('./urlToImage');

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

// domain
Queue.User = User;
Queue.Schema = Schema;
Queue.Document = Document;
Queue.LiveQuery = LiveQuery;
Queue.File = File;
Queue.Email = Email;
Queue.Payment = Payment;
// functions
Queue.blobToDataUrl = blobToDataUrl;
Queue.canvasToBlob = canvasToBlob;
Queue.imageResize = imageResize;
Queue.createPromise = createPromise;
Queue.urlToImage = urlToImage;

module.exports = Queue;
