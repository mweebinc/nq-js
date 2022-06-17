const http = require('http');
const appId = '6560588f36297abd70cb7433774d5e09';
const masterKey = '43600a5f650ed69e3391ccdf271332d437f4026e';
const contentType = 'application/json';
const HttpRestAdapter = require('../src/adapters/rest/HttpRestAdapter');

describe('http rest adapter test', () => {
    xit('should perform GET request for schema', function(done){
        const httpRestAdapter = new HttpRestAdapter(http);
        const url = 'http://localhost/v1/schemas/products'
        const options = {
            method : 'GET',
            headers : {
                'Content-Type' : contentType,
                'X-Application-Id' : appId,
                'X-Master-Key' : masterKey
            }
        }
        httpRestAdapter.request(url, options)
            .then((response) => {
                console.log(response)
                done();
            })
            .catch(done.fail);
    })
})