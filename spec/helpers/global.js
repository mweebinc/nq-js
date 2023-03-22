const cache = {};
const localStorage = {
    getItem: function (key) {
        return cache[key];
    },
    setItem: function (key, value) {
        cache[key] = value;
    }
}
global.window = {localStorage};