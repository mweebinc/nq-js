const getController = require('../controllers')

class Document {
    //index tawagin si Document(?)
    constructor() {
        this.rest = getController();
    }
    //dito implementation ng rest controller
    //i-specify yung request POST, GET, UPDATE, DELETE

    testFunction(){
        console.log('hello from document')
    }

    create(collection, document){
        const path = '/classes/' + collection
        const options = {
            body : document
        }
        return this.rest.request('POST', path, options)
    }
    update(collection, document){
        const path = '/classes/' + collection + '/' + document.id
        const options = {
            body : document
        }
        return this.rest.request('PUT', path, options);
    }
    find(collection, documentId){
        const path = '/classes/' + collection + '/' + documentId;
        return this.rest.request('GET', path)
    }
    delete(collection, documentId){
        const path = '/classes/' + collection + '/' + documentId
        return this.rest.request('DELETE', path)
    }
    findAll(collection){
        const path = '/classes/' + collection
        return this.rest.request('GET', path);
    }
}
module.exports = Document;