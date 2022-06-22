function handleProgress(type, event, options) {
    if (options && typeof options.progress === 'function') {
        if (event.lengthComputable) {
            options.progress(event.loaded / event.total, event.loaded, event.total, {type});
        } else {
            options.progress(null, null, null, {type});
        }
    }
}

// export default handleProgress;
module.exports = handleProgress