function handleProgress(type, event, options) {
    // event.loaded - how many bytes downloaded
    // event.lengthComputable = true if the server sent Content-Length header
    // event.total - total number of bytes (if lengthComputable)
    if (options && typeof options.progress === 'function') {
        if (event.lengthComputable) {
            options.progress(event.loaded / event.total, event.loaded, event.total, {type});
        } else {
            options.progress(null, null, null, {type});
        }
    }
}

// module.exports = handleProgress;
module.exports = handleProgress