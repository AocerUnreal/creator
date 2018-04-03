
cc.Class({
    extends: cc.Component,
    properties: {
        socketio: null,
        isPinging: false,
        reconnectCount: 1,
        isReconnecting: false,
        lastSendTime: Date.now(),
        lastRecieveTime: Date.now(),
        connectCount: 1,
    },
    connect(connectCallback) {
        var self = this;
        let connectURL = "{0}:{1}".format(
                                    _IGC_SERVER_BUFFER[_IGC_SERVER_INDEX_].HOST, 
                                    _IGC_SERVER_BUFFER[_IGC_SERVER_INDEX_].PORT
                                );
        var opts = {
            'reconnection': false,
            'force new connection': true,
            'transports': ['websocket', 'polling']
        }
        this.socketio = window.io.connect(connectURL, opts);
        this.socketio.on('connect', function() {
            self.socketio.connected = true;
            self.isReconnecting = false;
            if (connectCallback) {
                connectCallback(_IGC_SOCKET_STATUS_LINK_, null);
            }
        });
        this.socketio.on('connect_error', function(data) {
            if (self.isReconnecting == false) {
                self.isReconnecting = true;
                setTimeout(function() {
                    self.isReconnecting = false;
                    self.socketio = null;
                    self.connect();
                    self.reconnectCount++;
                }, 3000);
            }
            if (connectCallback) {
                connectCallback(_IGC_SOCKET_STATUS_SHUT_, null);
            }
        });
        this.socketio.on('connect_timeout', function(timeout) {
        });
        this.socketio.on('connecting', function() {
        });
        this.socketio.on('disconnect', function(reason) {
            self.socketio.connected = false;
            if (self.isReconnecting == false) {
                self.isReconnecting = true;
                setTimeout(function() {
                    self.isReconnecting = false;
                    self.socketio = null;
                    self.connect();
                    self.reconnectCount++;
                }, 3000);
            }
            if (connectCallback) {
                connectCallback(_IGC_SOCKET_STATUS_SHUT_, null);
            }
        });
        this.socketio.on('error', function(data) {
        });
        this.socketio.on('reconnect', function(attempt) {
        });
        this.socketio.on('reconnect_attempt', function(attempts) {
        });
        this.socketio.on('reconnect_failed', function() {
        });
        this.socketio.on('reconnect_error', function(data) {
        });
        this.socketio.on('reconnecting', function(attempts) {
        });
        this.socketio.on('IGC_PONG', function() {
            self.lastRecieveTime = Date.now();
            _IGC_PING_LATENCY_ = self.lastRecieveTime - self.lastSendTime;
        });
        this.socketio.on(_IGC_SOCKET_KEY_, function(packet) {
            packet = packet.replace(/"/g, "");
            var decryptPacket = CryptoJS.AES.decrypt(packet, _IGC_CRYPTO_KEY_).toString(CryptoJS.enc.Utf8);
            let data = JSON.parse(decryptPacket);
            if (connectCallback) {
                connectCallback(_IGC_SOCKET_STATUS_READ_, data);
            }
        });

        if (this._intervalID && this._intervalID != 0) {
            clearInterval(this._intervalID);
        }
        this._intervalID = setInterval(function() {
            self.lastSendTime = Date.now();
            self.ping();
        }.bind(this), 5000);
    },
    ping() {
        if (this.socketio && this.socketio.connected) {
            this.socketio.emit('IGC_PING', null);
        }
    },
    send(packet) {
        if (this.socketio && this.socketio.connected) {
            var encryptPacket = CryptoJS.AES.encrypt(JSON.stringify(packet), _IGC_CRYPTO_KEY_).toString();
            this.socketio.emit(_IGC_SOCKET_KEY_, encryptPacket)
        }
    },
    close() {
        if (this.socketio && this.socketio.connected) {
            if (igc_utils.isFunction(this.socketio.close)) {
                this.socketio.close();
            }
            this.socketio.connected = false;
            this.socketio = null;
        }
    },
});
