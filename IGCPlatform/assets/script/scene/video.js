
cc.Class({
    extends: cc.Component,

    properties: {
        videoPlayer: cc.VideoPlayer,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        var self = this;
        var currentTime = 0;
        cc.game.on(cc.game.EVENT_HIDE, function(event) {
            if (self.videoPlayer != null) {
                currentTime = self.videoPlayer.currentTime;
            }
        }, this);
        cc.game.on(cc.game.EVENT_SHOW, function(event) {
            if (self.videoPlayer != null) {
                self.videoPlayer.currentTime = currentTime;
                self.videoPlayer.play();
            }
        }, this);

        // this.videoPlayer.node.on('clicked', function(event) {
        //     cc.director.loadScene('logon');
        // }, this);

        // this.videoPlayer.node.on('completed', function(event) {
        //     cc.director.loadScene('logon');
        // }, this);
    },

    videoPlayerEvent(sender, event) {
        cc.log("######### videoPlayerEvent(sender, event)");
        if(event === cc.VideoPlayer.EventType.READY_TO_PLAY) {
            cc.log("######### videoPlayerEvent(sender, event) READY_TO_PLAY");
            this.videoPlayer.play();
        } else if(event === cc.VideoPlayer.EventType.CLICKED) {
            cc.log("######### videoPlayerEvent(sender, event) CLICKED");
            cc.game.targetOff(this);
            cc.director.loadScene('logon');
        } else if(event === cc.VideoPlayer.EventType.COMPLETED) {
            cc.log("######### videoPlayerEvent(sender, event) COMPLETED");
            cc.game.targetOff(this);
            cc.director.loadScene('logon');
        }
    },

    // update (dt) {},
});
