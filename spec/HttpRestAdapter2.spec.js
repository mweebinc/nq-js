const http = require('http');
const appId = '6560588f36297abd70cb7433774d5e09';
const masterKey = '43600a5f650ed69e3391ccdf271332d437f4026e';
const contentType = 'application/json';
const getHttpRestAdapter = require('../src/adapters/rest/http');

const adapter = getHttpRestAdapter();
const port = 5434;
let server;
const url = 'http://localhost:' + port;
beforeAll((done) => {
    server = http.createServer((req, res) => {
        res.statusCode = 200;
        for (const name in req.headers) {
            res.setHeader(name, req.headers[name]);
        }
        const chunks = [];
        req.on('data', chunk => {
            chunks.push(chunk);
        });
        req.on('end', () => {
            const body = Buffer.concat(chunks);
            const response = {
                method: req.method,
                body: body.toString(),
            }
            res.end(JSON.stringify(response));
        });
        if (req.method === 'GET') {
            res.end('{"status":"success"}');
        }
    });
    server.listen(port, done);
});
afterAll((done) => {
    server.close(done);
});

describe('http rest adapter test', () => {
    it('should get by default', function (done) {
        adapter.request(url)
            .then(response => {
                expect(response.status).toEqual('success');
                done();
            })
            .catch(done.fail);
    });
    it('should post', function (done) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"data": "test"})
        }
        adapter.request(url, options)
            .then(response => {
                expect(response.method).toEqual('POST');
                expect(response.body).toEqual('{"data":"test"}');
                done();
            })
            .catch(done.fail);
    });
})
