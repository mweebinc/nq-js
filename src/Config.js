// global data
const config = {
    SERVER_URL: 'https://api.innque.com/v1',
    APPLICATION_ID: undefined,
    LIVEQUERY_SERVER_URL: undefined,
}
/**
 * A singleton object responsible for App configuration
 */
const Config = {
    get: function (key) {
        if (config.hasOwnProperty(key)) {
            return config[key];
        }
        throw new Error('Configuration key not found.');
    },
    set: function (key, value) {
        config[key] = value;
    }
}
// add cache to Application id
// @todo this is temporary solution maybe we can think much better

Object.defineProperty(config, 'APPLICATION_ID', {
    get: function () {
        return window.localStorage.getItem('APPLICATION_ID');
    },
    set: function (value) {
        window.localStorage.setItem('APPLICATION_ID', value);
    }
});
module.exports = Config;
