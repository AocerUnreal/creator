
cc.Class({
    extends: cc.Component,

    properties: {
        loading: cc.Sprite,
        progressBar: cc.ProgressBar,
        updateLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        var self = this;
        if (_IGC_CURRENT_ASSETSMANAGER) {
            igc_utils.startHotUpdate(_IGC_CURRENT_ASSETSMANAGER, function(code, event) {
                switch (code) {
                    case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                        var totalBytes = event.getTotalBytes();
                        if (totalBytes > 0) {
                            if (totalBytes > 1024 * 1024) {
                                self.updateLabel.string = '[' + (event.getDownloadedBytes() / 1024 / 1024).toFixed(2) + 'M / ' + (totalBytes / 1024 / 1024).toFixed(2) + 'M] 正在下载更新...';
                            } else if (totalBytes > 1024) {
                                self.updateLabel.string = '[' + (event.getDownloadedBytes() / 1024).toFixed(2) + 'kb / ' + (totalBytes / 1024).toFixed(2) + 'kb] 正在下载更新...';
                            } else {
                                self.updateLabel.string = '[' + event.getDownloadedBytes() + 'Byte / ' + totalBytes + 'Byte] 正在下载更新...';
                            }
                        }
                        var percent = event.getPercent();
                        self.progressBar.progress = percent;
                    break;
                    case jsb.EventAssetsManager.UPDATE_FINISHED:
                        cc.audioEngine.stopAll();
                        cc.game.restart();
                    break;
                    case jsb.EventAssetsManager.UPDATE_FAILED:
                            
                    break;
                    default:break;
                }
            });
        }
        
        this.loading.node.runAction(cc.repeatForever(cc.rotateBy(1, 180)));
    },

    // update (dt) {},
});
