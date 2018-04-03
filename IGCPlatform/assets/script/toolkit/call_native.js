
////////////////////////////////////////////////////////////////////////////////////////////////////
// var className = "org/cocos2dx/javascript/AppActivity";
// var methodName = "showAlertDialog";
// var methodSignature = "(Ljava/lang/String;Ljava/lang/String;)V";
////////////////////////////////////////////////////////////////////////////////////////////////////
const igc_class_name_android = "com/aocer/platform/DGLuaOCBridge";
const igc_class_name_ios = "DGLuaOCBridge";
window._IGC_KEY_CHAIN_STORE_STRING_ = "com_aocer_platform_keychain_uuid";
/**
 * arguments
 * [1] method name
 * [2] method signature
 * [3] parameters ... 暂只支持4个参数
 */
window.igc_native = function(name, callback, ...parameters) {
    var igc_class_name = "null";
    if (cc.sys.platform === sys.ANDROID) {
        igc_class_name = igc_class_name_android;
    } else if (cc.sys.platform === sys.IPAD || cc.sys.platform === sys.IPHONE) {
        igc_class_name = igc_class_name_ios;
    }
    if (igc_class_name === "null") {
        return "not supported on current platform";
    }
    if (callback != null && callback != "") {
        var kVector= new Array();
        kVector = callback.split(".");
        var realCallback = "cc.find('Canvas').getComponent('{0}').{1}".format(kVector[0], kVector[1]);
        jsb.reflection.callStaticMethod(igc_class_name, "registerJSBridgeCallBack:", realCallback);
    }
    switch (parameters.length) {
        case 0:
            return jsb.reflection.callStaticMethod(igc_class_name, name);
            break;
        case 1:
            igc_utils.log("parameters 1 : " + parameters[0]);
            return jsb.reflection.callStaticMethod(igc_class_name, name, parameters[0]);
            break;
        case 2:
            igc_utils.log("parameters 2 : " + parameters[0] + ", " + parameters[1]);
            return jsb.reflection.callStaticMethod(igc_class_name, name, parameters[0], parameters[1]);
            break;
        case 3:
            igc_utils.log("parameters 3 : " + parameters[0] + ", " + parameters[1] + ", " + parameters[2]);
            return jsb.reflection.callStaticMethod(igc_class_name, name, parameters[0], parameters[1], parameters[2]);
            break;
        case 4:
            igc_utils.log("parameters 4 : " + parameters[0] + ", " + parameters[1] + ", " + parameters[2] + ", " + parameters[3]);
            return jsb.reflection.callStaticMethod(igc_class_name, name, parameters[0], parameters[1], parameters[2], parameters[3]);
            break;
        default:break;
    }
}


