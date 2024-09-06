// global data
const config = {
    SERVER_URL: 'https://api.innque.com/v1',
    APPLICATION_ID: null,
    LIVEQUERY_SERVER_URL: null,
}
/**
 * A singleton object responsible for App configuration
 */
const Config = {
    get: function (key) {
        if (config.hasOwnProperty(key)) {
            if (key === 'APPLICATION_ID') {
                return config[key] || window.localStorage.getItem(key);
            }
            return config[key];
        }
        throw new Error('Configuration key not found.');
    },
    set: function (key, value) {
        config[key] = value;
    }
}
module.exports = Config;
