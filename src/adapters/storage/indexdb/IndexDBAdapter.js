class IndexedDB {
    constructor(dbName, version) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
    }

    // Open or create IndexedDB
    open() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                resolve(this.db);
                return;
            }
            const request = indexedDB.open(this.dbName, this.version);
            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                // Create collections as object stores
                if (!this.db.objectStoreNames.contains('documents')) {
                    this.db.createObjectStore('documents', {keyPath: 'id'});
                }
            };
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };
            request.onerror = (event) => {
                console.error("IndexedDB error:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Generic method to handle transactions
    _transaction(storeName, mode, action) {
        return this.open().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([storeName], mode);
                const objectStore = transaction.objectStore(storeName);

                const request = action(objectStore);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);

                transaction.onerror = (event) => {
                    console.error("Transaction error:", event.target.error);
                    reject(event.target.error);
                };
            });
        });
    }

    // Add or update a document in the store
    insert(object) {
        return this._transaction('documents', 'readwrite', store => {
            return store.put(object);
        });
    }

    // Retrieve a document by id
    getDocument(id) {
        return this._transaction('documents', 'readonly', store => {
            return store.get(id);
        });
    }

    // Remove a document by id
    deleteDocument(id) {
        return this._transaction('documents', 'readwrite', store => {
            return store.delete(id);
        });
    }

    // Retrieve all documents
    find() {
        return this._transaction('documents', 'readonly', store => {
            return store.getAll();
        });
    }
}

export default IndexedDB;