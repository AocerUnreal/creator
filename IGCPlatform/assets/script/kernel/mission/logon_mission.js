
var logon_sink = null;

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    ctor() {
        // 登录成功
        igc_mission.connect.addEventListener(MDM_LG_USERLOGON, SUB_LG_LOGONSUCCESS, this.logonSuccess);
        // 登录失败
        igc_mission.connect.addEventListener(MDM_LG_USERLOGON, SUB_LG_LOGONFAILED, this.logonFailed);
    },

    setSink(sink) {
        logon_sink = sink;
    },

    // 账号注册
    accountRegister(packet) {
        igc_mission.connect.send(packet, MDM_LG_USERLOGON, SUB_LG_REGISTEACCOUNT);
    },

    // 账号登录
    accountLogon(packet) {
        igc_mission.connect.send(packet, MDM_LG_USERLOGON, SUB_LG_LOGONACCOUNT);
    },

    // 登录成功
    logonSuccess(data) {
        if (logon_sink) {
            logon_sink.logonSuccess(data);
        }
    },

    // 登录失败
    logonFailed(data) {
        if (logon_sink) {
            logon_sink.logonFailed(data);
        }
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
