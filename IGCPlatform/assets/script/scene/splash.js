
cc.Class({
    extends: cc.Component,

    properties: {
        manifestUrl: cc.RawAsset,
        checkUpdateButton: cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:
    
    start () {

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // 【框架初始化区域】开始
        // 
        // 【工具包】
        require("init_toolkit");
        // 【内核】
        require("init_kernel");
        // 【初始化链接】
        igc_mission.connect.addEventListener("CONNECT", "LINK", function(data) {
            
        });
        igc_mission.connect.connectToServer();
        // 【框架初始化区域】结束
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        var self = this;
        var dialog = null;
        igc_utils.checkHotUpdate(this.manifestUrl, function(hasUpdate) {
            if (hasUpdate) {
                cc.loader.loadRes("uikit/dialogprefab", function (err, prefab) {
                    dialog = cc.instantiate(prefab);
                    cc.director.getScene().addChild(dialog);
                    var dialogScript = dialog.getComponent( 'dialog' );
                    var currentVersion = _IGC_CURRENT_ASSETSMANAGER.getLocalManifest().getVersion();
                    var newestVersion = _IGC_CURRENT_ASSETSMANAGER.getRemoteManifest().getVersion();
                    var contentString = '<color=#FFE089>发现新版本, 需要更新!\n当前资源版本: v' + currentVersion + '\n最新资源版本: v' + newestVersion + '</color>';
                    dialogScript.setContentString(contentString);
                    dialogScript.setButtonCallback(function(event) {
                        switch (event) {
                            case 'confirm':
                                    dialog.destroy();
                                    cc.director.loadScene('update');
                                break;
                            case 'cancel':
                                    dialog.active = false;
                                    self.checkUpdateButton.node.active = true;
                                break;
                            case 'close':
                                
                                break;
                            default:break;
                        }
                    });
                });
            } else {
                if (_IGC_CURRENT_ASSETSMANAGER && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
                    _IGC_CURRENT_ASSETSMANAGER.release();
                }
                _IGC_CURRENT_ASSETSMANAGER = null;
                
                if (cc.sys.isNative && (cc.sys.os === cc.sys.OS_WINDOWS || cc.sys.platform === cc.sys.WIN32 || cc.sys.os === cc.sys.OS_OSX || cc.sys.platform === cc.sys.MACOS)) {
                    cc.director.loadScene('logon');
                } else {
                    cc.director.loadScene('video');
                }
            }
        });

        self.checkUpdateButton.node.active = false;
        this.checkUpdateButton.node.on('click', function(event) {
            dialog.active = true;
            self.checkUpdateButton.node.active = false;
        }, this);
    },

    // update (dt) {},
});
