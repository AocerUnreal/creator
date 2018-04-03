
cc.Class({
    extends: cc.Component,

    properties: {
        panel: cc.Node,
        content: cc.RichText,
        confirmButton: cc.Button,
        cancelButton: cc.Button,
        closeButton: cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
        this.confirmButton.node.on('click', function(event) {
            if (this.buttonCallback) {
                this.buttonCallback('confirm');
            }
        }, this);
        
        this.cancelButton.node.on('click', function(event) {
            if (this.buttonCallback) {
                this.buttonCallback('cancel');
            }
        }, this);
        
        this.closeButton.node.on('click', function(event) {
            if (this.buttonCallback) {
                this.buttonCallback('close');
            }
        }, this);
        
        igc_utils.popScaleDialog(this.panel);
    },

    setButtonCallback(callback) {
        this.buttonCallback = callback;
    },

    setContentString(contentString) {
        this.content.string = contentString;
    },

    // update (dt) {},
});
