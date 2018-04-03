// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        head: cc.Sprite,
        boy: cc.Sprite,
        girl: cc.Sprite,
        nickname: cc.Label,
        gameid: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var self = this;
        
        cc.loader.load({url: _IGC_WECHAT_USERINFO_.headimgurl, type: 'png'}, function (error, texture) {
            self.head.spriteFrame.setTexture(texture);
        });
        this.boy.node.active = false;
        this.girl.node.active = false;
        if (_IGC_WECHAT_USERINFO_.sex == 0) {
            this.boy.node.active = true;
        } else {
            this.girl.node.active = true;
        }
        this.nickname.string = _IGC_WECHAT_USERINFO_.nickname;
        this.gameid.string = _IGC_WECHAT_USERINFO_.unionid.toUpperCase();
    },

    // update (dt) {},
});
