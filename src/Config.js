// global data
const config = {
    SERVER_URL: 'https://api.innque.com/v1',
    APPLICATION_ID: 'appid',
    LIVEQUERY_SERVER_URL: 'ws://localhost:5683',
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
