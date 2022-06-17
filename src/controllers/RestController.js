//headers
//urls
//crud
const Config = require('../Config');

class RestController{
    constructor(adapter, cache) {
        this.adapter = adapter;
        this.cache = cache;
    }

    //null
    getUser(){
        this.cache.get('token')
            .then((session) => {
                this.session = session;
            })
    }
    setSession(session){
        this.cache.set({token : session});
    }

    clearSession(){
        this.cache.clear()
    }

    setAppId() {
        this.appId = Config.get('APPLICATION_ID');
    }
    setMasterKey(){
        this.masterKey = Config.get('MASTER_KEY');
    }
    setUrl(path){
        const base = Config.get('SERVER_URL');
        return new URL(base + path);
    }
    writeHeader(){
        this.headers = {};
        this.headers['Content-Type'] = 'application/json';
        this.headers['X-Application-Id'] = this.appId;
        this.headers['X-Master-Key'] = this.masterKey;
        if(this.session){
            this.headers['X-Session-Token'] = this.session.token
        }
    }
    //get path
    init(path){
        return Promise.resolve()
            .then(() => this.setAppId())
            .then(() => this.setMasterKey())
            .then(() => this.getUser())
            .then(() => this.writeHeader())
            .then(() => this.setUrl(path));
    }
    //accessible sa labas
    request(method, path, args = {}){
        if(args && args.body){
            args.body = JSON.stringify(args.body);
        }
        return this.init(path)
            .then((url) => this.send(url, {method, ...args}));
    }
    send(url, args){
        if (args.query) {
            for (const p in args.query) {
                url.searchParams.set(p, JSON.stringify(args.query[p]));
            }
        }
        if(args.headers){
            this.headers = Object.assign(this.headers, args.headers)
        }
        if(args.session) {
            this.headers['X-Session-Token'] = args.session;
        }
        const options = {
            method : args.method,
            body : args.body,
            headers : this.headers
        }
        return this.adapter.request(url, options);
    }
}
module.exports = RestController;