const EventEmitter = require('events');

/**
 * Wrapper class for WebSocket Client
 */
class Socket extends EventEmitter {
    /**
     * @param url The WebSocket Server
     * @param timeout The timeout ping pong
     */
    constructor(url, timeout = 10) {
        super();
        this.url = url;
        this.timeout = timeout;
    }

    /**
     * Open new connection
     */
    open() {
        this.ws = new WebSocket(this.url);
        this.ws.onopen = () => {
            this.waitingForPong = false;
            // heartbeat
            // send ping to server periodically
            // if no pong within in time interval socket will be disconnected
            const pingIntervalId = setInterval(() => {
                if (!this.waitingForPong) {
                    this.ws.send('ping');
                    this.waitingForPong = true;
                } else {
                    clearInterval(pingIntervalId);
                    this.ws.close();
                }
            }, this.timeout * 1000);
            this.emit('open');
        }
        this.ws.onmessage = message => {
            message = message && message.data ? message.data : message;
            if (message === 'pong') {
                this.waitingForPong = false;
                return;
            }
            try {
                message = JSON.parse(message);
            } catch (e) {
                console.log('unable to parse request', message, e);
                return;
            }
            this.emit('message', message);
        }
        this.ws.onclose = () => this.emit('close');
        this.ws.onerror = (error) => this.emit('error', error);
    }

    /**
     * Send JSON data
     * @param data @type {{}}
     */
    send(data) {
        try {
            data = JSON.stringify(data);
        } catch (error) {
            console.log('unable to parse data', data, e);
            return;
        }
        this.ws.send(data);
    }

    /**
     * Close the connection
     */
    close() {
        this.ws.close();
    }

}

module.exports = Socket;
