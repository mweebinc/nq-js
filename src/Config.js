const config = {
    SERVER_URL : '',
    APPLICATION_ID : null,
    MASTER_KEY : null
}

const Config = {
    get : function(key){
        if(config.hasOwnProperty(key)){
            return config[key];
        }
        throw new Error('Configuration key not found.');
    },
    set : function(key, value){
        config[key] = value
    }
}
module.exports = Config;