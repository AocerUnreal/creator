
cc.Class({
    extends: cc.Component,
    properties: {
    },
    ctor() {
        this.node = new cc.Node("connect_mission");
        var require_socket = require("socket");
        this.socket = new require_socket();
    },
    send(packet, main, sub) {
        packet.MainID = main;
        packet.SubID = sub;
        this.socket.send(packet);
    },
    connectToServer() {
        var self = this;
        this.socket.connect(function(status, data) {
            switch (status) {
                case _IGC_SOCKET_STATUS_LINK_: {
                    self.dispatchEvent("CONNECT", "LINK");
                } break;
                case _IGC_SOCKET_STATUS_READ_: {
                    self.dispatchEvent(data.MainID, data.SubID, data);
                } break;
                case _IGC_SOCKET_STATUS_SHUT_: {
                } break;
                default:break;
            }
        });
    },
    addEventListener(main, sub, eventCallback) {
        this.node.on("IGC_EVENT_ID_" + main + "_" + sub, function(event) {
            eventCallback(event.detail);
        });
    },
    removeEventListener(main, sub) {
        this.node.off("IGC_EVENT_ID_" + main + "_" + sub, null, this);
    },
    dispatchEvent(main, sub, data) {
        this.node.emit("IGC_EVENT_ID_" + main + "_" + sub, data);
    },
});
