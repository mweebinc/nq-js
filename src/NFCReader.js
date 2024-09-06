/* global NDEFReader, NDEFReadingEvent, NDEFWriter */

const hexToDecimal = require('./hexToDecimal.js');
class NFCReader extends EventTarget {
    reader = window.NDEFReader ? new NDEFReader() : new EventTarget();  // Initialize the NDEFReader or fallback to an EventTarget.
    ignoreRead = false;   // Flag to ignore read events.
    // The controller is an instance of AbortController.
    // It provides the ability to abort or cancel ongoing operations,
    // like NFC scans, giving you granular control over their lifecycle.
    controller = null;    // Controller for scanning and stopping.

    constructor() {
        super();
        this.reader.addEventListener("reading", event => {
            // Extract serial number from the event.
            const serialNumber = event.serialNumber;
            const decimal = hexToDecimal(serialNumber);
            // Create and dispatch a custom event with the serial number as detail.
            const customEvent = new CustomEvent('reading', {
                detail: {serialNumber: decimal}
            });
            this.dispatchEvent(customEvent);
        });
    }

    async write(ndef, options) {
        this.ignoreRead = true;
        if (this.reader.write) {
            await this.reader.write(ndef, options);
        } else {
            const writer = new NDEFWriter();
            await writer.write(ndef, options);
        }
        this.ignoreRead = false;
    }

    scan() {
        if (!this.controller) {
            this.controller = new AbortController();
            this.reader.scan({signal: this.controller.signal});
        }
    }

    stop() {
        if (this.controller) {
            this.controller.abort();
            this.controller = null;
        }
    }

    async checkNFCPermission() {
        // Check if the browser supports the Web NFC API
        if (!('NDEFReader' in window)) {
            console.error("Web NFC is not supported in this browser.");
            return;
        }

        try {
            const status = await navigator.permissions.query({name: "nfc"});

            if (status.state === "granted" || status.state === "denied") {
                console.log(`NFC permission ${status.state}`);
                if (status.state === "granted") {
                    this.scan();
                }
            } else {
                const ndef = new NDEFReader();
                await ndef.scan();
                console.log("NFC permission granted after request");
                this.scan();
            }
        } catch (err) {
            console.error("Error with NFC operation", err);
        }
    }
}

module.exports = NFCReader;