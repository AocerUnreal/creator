
cc.Class({
    extends: cc.Component,

    properties: {
        wechatButton: cc.Button,
        nickName: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
        // this.logonButton.node.active = false;

        igc_mission.logon.setSink(this);

        // this.logonButton.node.on('click', function(event) {
        //     // var button = event.detail;
        //     var accounts = this.accountEditbox.string;
        //     var passWord = this.passwordEditbox.string;
        //     // 账号登录
        //     igc_mission.logon.accountLogon({
        //         accounts: accounts,
        //         passWord: passWord,
        //         machineID: "xxxxxxxxx-xxxxxxxxx-xxxxxxxxx-xx",
        //         logonChannel: 0,
        //     });
        // }, this);

        // this.registerButton.node.on('click', function(event) {
        //     // var button = event.detail;
        //     var accounts = this.accountEditbox.string;
        //     var passWord = this.passwordEditbox.string;
        //     // 账号注册
        //     igc_mission.logon.accountRegister({
        //         accounts: accounts,
        //         passWord: passWord,
        //         nickName: accounts,
        //         machineID: "xxxxxxxxx-xxxxxxxxx-xxxxxxxxx-xx",
        //         logonChannel: 0,
        //     });
        // }, this);

        

        this.wechatButton.node.on('click', function(event) {
            // var button = event.detail;
            igc_native("LoginWX", "logon.wechatCallback");
        }, this);

    },

    wechatCallback(authResp) {
        var self = this;
        var kVector= new Array();
        kVector = authResp.split(":");
        if (kVector.length != 4) {
            return;
        }
        var kUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid={0}&secret={1}&code={2}&grant_type={3}".format(kVector[0], kVector[1], kVector[2], kVector[3]);
        function requestCallback(response) {
            let data = JSON.parse(response);
            let access_token = data["access_token"]
            let expires_in = data["expires_in"]
            let refresh_token = data["refresh_token"]
            let openid = data["openid"]
            let scope = data["scope"]
            let unionid = data["unionid"]
            
            let kUserInfoUrl = "https://api.weixin.qq.com/sns/userinfo?access_token={0}&openid={1}".format(access_token, openid);
            self.requestUserInfo(kUserInfoUrl);
        }
        igc_utils.httpRequest("POST", kUrl, requestCallback, true);
    },

    requestUserInfo(url) {
        function requestCallback(response) {
            igc_utils.log(response);
            _IGC_WECHAT_USERINFO_ = JSON.parse(response);
            cc.director.loadScene('hall');
        }
        igc_utils.httpRequest("POST", url, requestCallback, true);
    },

    // 登录成功
    logonSuccess(data) {
        this.nickName.string = data.nickName;
    },

    // 登录失败
    logonFailed(data) {
        this.nickName.string = data.describeString;
    },

    // update (dt) {},
});
