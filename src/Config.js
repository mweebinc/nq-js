// global data
const config = {
    SERVER_URL: 'https://api.innque.com/v1',
    APPLICATION_ID: '6560588f36297abd70cb7433774d5e09',
    LIVEQUERY_SERVER_URL: undefined,
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
