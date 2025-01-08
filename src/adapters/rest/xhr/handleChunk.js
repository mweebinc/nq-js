function handleChunk(chunk, position = 0) {
    const results = [];
    let start = 0; // To remember the start of the top-level object
    let nested = 0; // To track the depth of nested braces
    let remain = 0; // To store any incomplete JSON object
    while (position < chunk.length) {
        const open = chunk.indexOf('{', position);
        const close = chunk.indexOf('}', position);
        // Handle cases where no more complete objects can be found
        if (open === -1 && close === -1) {
            break;
        }
        if (open !== -1 && (open < close || close === -1)) {
            if (nested === 0) {
                start = open;  // Mark the start of a new top-level object
            }
            nested++;
            position = open + 1;
            continue;
        }
        if (close !== -1 && (close < open || open === -1)) {
            nested--;
            if (nested === 0) {
                const json = chunk.substring(start, close + 1);
                remain = close + 1;
                try {
                    const object = JSON.parse(json);
                    results.push(object);
                } catch (error) {
                    console.error("Failed to parse JSON object:", json);
                }
            }
            position = close + 1;
        }
    }

    return [results, remain];
}

module.exports = handleChunk;