const click = require('./click');
const createPromise = require('./createPromise');

/**
 * @param accept file type
 * @returns {Promise | Promise<unknown>}
 */
function browseFile(accept, multiple = false) {
    const p = createPromise();
    const input = document.createElement('input');
    input.type = "file";
    input.accept = accept;
    input.multiple = multiple;
    input.onchange = function (e) {
        const files = e.target.files;
        p.resolve(files);
    }
    setTimeout(function () {
        click(input);
    }, 0);
    return p;
}

module.exports = browseFile;
