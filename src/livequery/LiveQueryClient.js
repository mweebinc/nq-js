const Subscription = require("./Subscription");

/**
 * This class handle the data sent to the Server
 */
class LiveQueryClient {
  /**
   * @param ws WebSocketAdapter
   * @param applicationId The current Application ID
   * @param sessionToken Session token of current user
   */
  constructor(applicationId, ws, sessionToken) {
    this.applicationId = applicationId;
    this.ws = ws;
    this.sessionToken = sessionToken;
    /**
     * @type {Map<string, Subscription>}
     */
    this.subscriptions = new Map();
    /**
     * Use number for autoincrement
     * Then convert to string when send to the server
     * @type {number}
     */
    this.subscriptionId = 1;
  }

  /**
   * Send connect operation to server
   */
  connect(session) {
    const data = {
      operation: "connect",
      applicationId: this.applicationId,
    };
    if (this.sessionToken || session) {
      data.sessionToken = session || this.sessionToken;
    }
    this.ws.send(data);
  }

  /**
   * Send subscribe operation to server
   * @param query
   * @param type - the type of operation to subscribe to (e.g., afterUpdate, afterInsert, afterDelete)
   * @param connectionPromise
   * @returns {Subscription}
   */
  subscribe(query, connectionPromise, type) {
    const subscription = new Subscription(this.subscriptionId + "", query);
    this.subscriptions.set(subscription.id, subscription);
    this.subscriptionId++;
    const data = {
      operation: "subscribe",
      subscriptionId: subscription.id,
      type: type,
      query: query,
    };
    connectionPromise.then(() => this.ws.send(data));
    // when subscription call the unsubscribe function
    subscription.on("unsubscribe", () =>
      this.unsubscribe(subscription, connectionPromise)
    );
    return subscription;
  }

  /**
   * send unsubscribe operation to server
   * @param subscription
   * @param connectionPromise
   */
  unsubscribe(subscription, connectionPromise) {
    if (subscription) {
      subscription.subscribed = false;
      const data = {
        operation: "unsubscribe",
        subscriptionId: subscription.id,
      };
      connectionPromise.then(() => this.ws.send(data));
    }
  }

  resubscribe(connectionPromise) {
    this.subscriptions.forEach((subscription) => {
      const data = {
        operation: "subscribe",
        subscriptionId: subscription.id,
        query: subscription.query,
      };
      connectionPromise.then(() => this.ws.send(data));
    });
  }

  /**
   * Close all subscriptions
   * @param connectionPromise
   * @param reset true if user close the connection false if unexpected disconnect
   */
  close(connectionPromise, reset = false) {
    this.subscriptions.forEach((subscription) => {
      subscription.emit("close");
      // notify the server for unsubscription
      if (reset) this.unsubscribe(subscription, connectionPromise);
    });
    if (reset) {
      // reset the subscription
      this.subscriptions = new Map();
      this.subscriptionId = 1;
    }
  }
}

module.exports = LiveQueryClient;
