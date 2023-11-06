class Queue {
    static setUrl(value) {
        require('./Config').set('SERVER_URL', value);
    }

    static setApplicationId(value) {
        require('./Config').set('APPLICATION_ID', value);
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

module.exports = Queue;
