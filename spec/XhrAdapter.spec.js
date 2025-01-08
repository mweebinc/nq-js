const XhrAdapter = require('../src/adapters/rest/xhr/XhrAdapter');  // import the XhrAdapter class

describe('XhrAdapter', () => {
    it('should send a GET request', async () => {
        function XHR() {
            this.response = '{"key":"value"}';
            this.status = 200;
            this.open = function () {

            };
            this.setRequestHeader = function () {

            };
            this.send = function () {
                // Simulate onload
                this.onload();
            };
            this.onerror = function () {

            };
            this.onload = function () {

            };
        }

        const adapter = new XhrAdapter(XHR);
        const response = await adapter.request('http://test.com', {
            method: 'GET', headers: {
                Authorization: 'Bearer token',
            },
        });
        expect(response).toEqual({key: 'value'});
    });
    it('should handle errors', async () => {
        function XHR() {
            this.response = 'Error Message';
            this.status = 500;  // Simulating an Internal Server Error
            this.open = function () {
            };
            this.setRequestHeader = function () {
            };
            this.send = function () {
                this.onerror();  // Simulate an error
            };
            this.onerror = function () {
            };
            this.onload = function () {
            };
        }

        const adapter = new XhrAdapter(XHR);
        try {
            const response = await adapter.request('http://test.com', {
                method: 'GET', headers: {
                    Authorization: 'Bearer token',
                },
            });
        } catch (error) {
            console.log(error);
            expect(error).toEqual('Error Message');
        }
    });
    it('should handle timeouts', async () => {
        function XHR() {
            this.response = 'Timeout';
            this.status = 0;
            this.open = function () {
            };
            this.setRequestHeader = function () {
            };
            this.send = function () {
                setTimeout(() => this.onerror(), 10);  // Simulate a timeout
            };
            this.onerror = function () {
            };
            this.onload = function () {
            };
        }

        const adapter = new XhrAdapter(XHR);

        try {
            const response = await adapter.request('http://test.com', {
                method: 'GET', headers: {
                    Authorization: 'Bearer token',
                },
            });
            expect(response).toBeUndefined();
        } catch (error) {
        }
    });
});
