const config = {
    SERVER_URL: 'api.innque.com/v1',
    APPLICATION_ID: null,
}

const Config = {
    get: function (key) {
        if (config.hasOwnProperty(key)) {
            return config[key];
        }
        throw new Error('Configuration key not found.');
    },
    set: function (key, value) {
        config[key] = value
    }
}
module.exports = Config;
