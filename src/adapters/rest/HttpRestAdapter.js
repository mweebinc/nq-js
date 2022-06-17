class HttpRestAdapter{
    constructor(http) {
        this.http = http
    }
    request(url, options){
        return new Promise((resolve, reject) => {
            if(this.http === null){
                throw new Error('Cannot make a request. No HTTP Request found.')
            }
            const http = this.http
            const req = http.request(url, options, res => {
                let chunks = [];
                res.on('data', chunk => {
                    chunks.push(chunk);
                })
                res.on('end', () => {
                    this.body = Buffer.concat(chunks).toString();
                    const jsonBody = JSON.parse(this.body);
                    resolve(jsonBody);
                })
                res.on('error', (error) => {
                    reject(error);
                })
            })
            options.body && req.write(options.body);
            req.end();
        });
    }
}
module.exports = HttpRestAdapter;