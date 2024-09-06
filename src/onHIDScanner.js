/**
 * onHIDScanner - A function to handle input events from an HID scanner.
 * @param {function} callback - A callback function to handle the scanned code.
 * @param {number} timeout - The maximum amount of time in milliseconds between individual key presses before a scan is considered complete.
 */

function onHIDScanner(callback, timeout = 100) {
    let reading = true;
    let code = "";

    function handleScanner(event) {
        // usually scanners throw an 'Enter' key at the end of read
        if (event.key === "Enter") {
            /// code ready to use
            if (code) {
                event.preventDefault();
                callback && callback(code);
            }
            code = "";
        } else {
            code += event.key; // store all input until Enter event
        }
        // clear everything if timeout trigger
        // nfc scanner average around 40ms to complete all 10 digits before enter
        if (reading) {
            reading = false;
            setTimeout(() => {
                reading = true;
                code = "";
            }, timeout);
        }
    }

    document.addEventListener('keydown', handleScanner);
    return () => document.removeEventListener('keydown', handleScanner);
}

module.exports = onHIDScanner;
