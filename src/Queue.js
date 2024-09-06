const Config = require('./Config');
class Queue {
    static setUrl(value) {
        Config.set('SERVER_URL', value);
    }

    static setApplicationId(value) {
        Config.set('APPLICATION_ID', value);
    }
}

// Assign classes to Queue
Queue.Schema = require('./domain/Schema');
Queue.Document = require('./domain/Document');
Queue.User = require('./domain/User');
Queue.File = require('./domain/File');
Queue.Email = require('./domain/Email');
Queue.Payment = require('./domain/Payment');
Queue.Rest = require('./domain/Rest');
Queue.LiveQuery = require('./livequery/LiveQuery');

// Assign functions to Queue
Queue.blobToDataUrl = require('./blobToDataUrl');
Queue.blobToImage = require('./blobToImage');
Queue.canvasToBlob = require('./canvasToBlob');
Queue.canvasToImage = require('./canvasToImage');
Queue.resize = require('./resize');
Queue.imageResize = require('./imageResize');
Queue.imageToCanvas = require('./imageToCanvas');
Queue.createPromise = require('./createPromise');
Queue.urlToImage = require('./urlToImage');
Queue.flatten = require('./flatten');
Queue.unflatten = require('./unflatten');
Queue.browseFile = require('./browseFile');
Queue.parseName = require('./parseName');
Queue.parse = require('./parse');
Queue.downloadFromURL = require('./downloadFromURL');
Queue.nameToNumber = require('./nameToNumber');
Queue.formatNumber = require('./formatNumber');
Queue.dateToMMDDYY = require('./dateToMMDDYY');
Queue.dateFormat = require('./dateFormat');
Queue.NFCReader = require('./NFCReader');
Queue.onHIDScanner = require('./onHIDScanner');
Queue.click = require('./click');
Queue.nodeToJson = require('./nodeToJson');
Queue.Config = Config;

module.exports = Queue;
