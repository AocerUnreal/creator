
cc.director.getPhysicsManager().enabled = true;

window.igc_utils = {}
window._IGC_CURRENT_ASSETSMANAGER = null;

// LOG输出
igc_utils.log = function(str) {
    console.log("[IGC LOG] - " + str);
}

// 检测是否为函数
igc_utils.isFunction = function(funName) {
    try {
        if(typeof funName === "function") {
            return true;
        } else {
            return false;
        }
    } catch(e) {}
    return false;
}

igc_utils.httpRequest = function(method, url, callback, async) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            var response = xhr.responseText;
            if (callback && igc_utils.isFunction(callback)) {
                callback(response);
            }
        }
    };
    xhr.open(method, url, async);
    xhr.send();
}

// 果冻弹窗
igc_utils.popFruitDialog = function(node) {
    node.setScale(0);
    var popFruitSeq = cc.sequence(
        cc.scaleTo(0.0001, 0.8, 1.3),
        cc.scaleTo(0.2, 1.0, 0.95),
        cc.scaleTo(0.1, 0.92, 1.05),
        cc.scaleTo(0.1, 1.0));
    node.runAction(popFruitSeq);
}

// 缩放弹窗
igc_utils.popScaleDialog = function(node) {
    node.setScale(0.34);
    node.runAction(cc.scaleTo(0.13, 1.0));
}



igc_utils.checkHotUpdate = function(manifestUrl, checkCallback) {
    
    if (_IGC_CURRENT_ASSETSMANAGER != null) {
        return;
    }

    if (!cc.sys.isNative) {
        checkCallback(false);
        return;
    }
    var self = this;
    self._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'igc-remote-asset');
    
    // if (cc.sys.isNative && (cc.sys.os === cc.sys.OS_WINDOWS || cc.sys.platform === cc.sys.WIN32)) {
    //     var manifestPath = self._storagePath + '/project.manifest';
    //     if (jsb.fileUtils.isFileExist(manifestPath)) {
    //         manifestUrl = manifestPath;
    //     }
    // }

    var assetsManager = new jsb.AssetsManager(manifestUrl, self._storagePath);
    if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
        assetsManager.retain();
    }
    _IGC_CURRENT_ASSETSMANAGER = assetsManager;
    
    var checkListener = new jsb.EventListenerAssetsManager(assetsManager, function (event) {
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                checkCallback(false);
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                checkCallback(true);
                break;
            default:
                return;
        }
        if (checkListener) {
            cc.eventManager.removeListener(checkListener);
            checkListener = null;
        }
    });
    cc.eventManager.addListener(checkListener, 1);
    assetsManager.checkUpdate();
}

igc_utils.startHotUpdate = function(assetsManager, updateCallback) {
    if (!cc.sys.isNative) {
        return;
    }

    var failCount = 0;
    var maxFailCount = 3;
    if (listener) {
        cc.eventManager.removeListener(listener);
        listener = null;
    }
    var listener = new jsb.EventListenerAssetsManager(assetsManager, function (event) {
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                    updateCallback(jsb.EventAssetsManager.UPDATE_PROGRESSION, event);
                break;
            case jsb.EventAssetsManager.ASSET_UPDATED:
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                    if (listener) {
                        cc.eventManager.removeListener(listener);
                        listener = null;
                    }
                    
                    var searchPaths = jsb.fileUtils.getSearchPaths();
                    var newPaths = assetsManager.getLocalManifest().getSearchPaths();
                    Array.prototype.unshift(searchPaths, newPaths);
                    
                    cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
                    jsb.fileUtils.setSearchPaths(searchPaths);
                    
                    if (assetsManager && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
                        assetsManager.release();
                    }
                    assetsManager = null;
                    updateCallback(jsb.EventAssetsManager.UPDATE_FINISHED, event);
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                    failCount++;
                    if (failCount < maxFailCount) {
                        assetsManager.downloadFailedAssets();
                    }
                    else {
                        failCount = 0;
                        updateCallback(jsb.EventAssetsManager.UPDATE_FAILED, event);
                    }
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                break;
            default: break;
        }
    });
    cc.eventManager.addListener(listener, 1);
    assetsManager.update();
}






////////////////////////////////////////////////////////////////////////////////////////////////////
// 扩展 
//
// 占位符格式化字符串
String.prototype.format = function() {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function(s, i) {
        return args[i];
    });
}





// /*
// * 格式化金额 个位起每三位逗号分隔 10,000.00
// * @param n 小数位
// * @return
// */
// String.prototype.toThousands = function (n) {
//     var n = n > 0 && n <= 20 ? n : 2;
//     var s = this;
//     s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
//     var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
//     t = "";
//     for (i = 0; i < l.length; i++) {
//         t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
//     }
//     return t.split("").reverse().join("") + "." + r;
// }

// /*
// * 类似C#中string.format函数
// * @return
// */
// String.prototype.format = function () {
//     var result = this;
//     if (arguments.length == 0)
//         return null;
//     for (var i = 0; i < arguments.length; i++) {
//         var re = new RegExp('\\{' + (i) + '\\}', 'gm');
//         result = result.replace(re, arguments[i]);
//     }
//     return result;
// };

// /*
// * 返回字符的长度，一个中文算2个
// * @return
// */        
// String.prototype.strLength = function () {
//     return this.replace(/[^\x00-\xff]/g, "**").length;
// };

// /*
// * 判断字符串是否以指定的字符串开始
// * @return
// */       
// String.prototype.strStartsWith = function (str) {
//     return this.substr(0, str.length) == str;
// };

// /*
// * 判断密码安全级别
// * @return
// */
// String.prototype.checkPassWordLevel = function () {
//     var n = 0;
//     if (/\d/.test(this)) n++; //包含数字  
//     if (/[a-z]/.test(this)) n++; //包含小写字母      
//     if (/[A-Z]/.test(this)) n++; //包含大写字母   
//     if (this.length <= 6) n = 1; //长度小于等于6位  
//     return n;
// }

// /*  
// * 检索数组元素（原型扩展或重载）  
// * @param o 被检索的元素值  
// * @returns 元素索引  
// */
// Array.prototype.contains = function (o) {
//     var index = -1;
//     for (var i = 0; i < this.length; i++) { if (this[i] == o) { index = i; break; } }
//     return index;
// }

// /*
// * 日期格式化（原型扩展或重载）  
// * 格式 YYYY/yyyy/YY/yy 表示年份  
// * MM/M 月份  
// * W/w 星期  
// * dd/DD/d/D 日期  
// * hh/HH/h/H 时间  
// * mm/m 分钟  
// * ss/SS/s/S 秒  
// * @param {formatStr} 格式模版  
// * @returns 日期字符串  
// */
// Date.prototype.formatDate = function (formatStr) {
//     var str = formatStr;
//     var Week = ['日', '一', '二', '三', '四', '五', '六'];
//     str = str.replace(/yyyy|YYYY/, this.getFullYear());
//     str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
//     str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
//     str = str.replace(/M/g, this.getMonth());
//     str = str.replace(/w|W/g, Week[this.getDay()]);
//     str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
//     str = str.replace(/d|D/g, this.getDate());
//     str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
//     str = str.replace(/h|H/g, this.getHours());
//     str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
//     str = str.replace(/m/g, this.getMinutes());
//     str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
//     str = str.replace(/s|S/g, this.getSeconds());
//     return str;
// }

// /*  
// * 比较日期差（原型扩展或重载）  
// * @param {strInterval} 日期类型：'y、m、d、h、n、s、w'  
// * @param {dtEnd} 格式为日期型或者 有效日期格式字符串  
// * @returns 比较结果  
// */
// Date.prototype.dateDiff = function (strInterval, dtEnd) {
//     var dtStart = this;
//     if (typeof dtEnd == 'string') { //如果是字符串转换为日期型   
//         dtEnd = StringToDate(dtEnd);
//     }
//     switch (strInterval) {
//         case 's': return parseInt((dtEnd - dtStart) / 1000);
//         case 'n': return parseInt((dtEnd - dtStart) / 60000);
//         case 'h': return parseInt((dtEnd - dtStart) / 3600000);
//         case 'd': return parseInt((dtEnd - dtStart) / 86400000);
//         case 'w': return parseInt((dtEnd - dtStart) / (86400000 * 7));
//         case 'm': return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
//         case 'y': return dtEnd.getFullYear() - dtStart.getFullYear();
//     }
// }

// /* 
// * 日期计算（原型扩展或重载）  
// * @param {strInterval} 日期类型：'y、m、d、h、n、s、w'  
// * @param {Number} 数量  
// * @returns 计算后的日期  
// */
// Date.prototype.dateAdd = function (strInterval, Number) {
//     var dtTmp = this;
//     switch (strInterval) {
//         case 's': return new Date(Date.parse(dtTmp) + (1000 * Number));
//         case 'n': return new Date(Date.parse(dtTmp) + (60000 * Number));
//         case 'h': return new Date(Date.parse(dtTmp) + (3600000 * Number));
//         case 'd': return new Date(Date.parse(dtTmp) + (86400000 * Number));
//         case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
//         case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
//         case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
//         case 'y': return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
//     }
// }

// /*  
// * 取得日期数据信息（原型扩展或重载）  
// * @param {interval} 日期类型：'y、m、d、h、n、s、w'  
// * @returns 指定的日期部分  
// */
// Date.prototype.datePart = function (interval) {
//     var myDate = this;
//     var partStr = '';
//     var Week = ['日', '一', '二', '三', '四', '五', '六'];
//     switch (interval) {
//         case 'y': partStr = myDate.getFullYear(); break;
//         case 'm': partStr = myDate.getMonth() + 1; break;
//         case 'd': partStr = myDate.getDate(); break;
//         case 'w': partStr = Week[myDate.getDay()]; break;
//         case 'ww': partStr = myDate.WeekNumOfYear(); break;
//         case 'h': partStr = myDate.getHours(); break;
//         case 'n': partStr = myDate.getMinutes(); break;
//         case 's': partStr = myDate.getSeconds(); break;
//     }
//     return partStr;
// }

// /*  
// * 字符串包含（原型扩展或重载）  
// * @param {string: str} 要搜索的子字符串  
// * @param {bool: mode} 是否忽略大小写  
// * @returns 匹配的个数  
// */
// String.prototype.matchCount = function (str, mode) {
//     return eval("this.match(/(" + str + ")/g" + (mode ? "i" : "") + ").length");
// }

// /*  
// * 去除左右空格（原型扩展或重载）  
// * @type string  
// * @returns 处理后的字符串  
// */
// String.prototype.trim = function () {
//     return this.replace(/(^\s*)|(\s*$)/g, "");
// }


// /*  
// * 字符串转换为日期型（原型扩展或重载）  
// * @type Date  
// * @returns 日期  
// */
// String.prototype.toDate = function () {
//     var converted = Date.parse(this);
//     var myDate = new Date(converted);
//     if (isNaN(myDate)) { var arys = this.split('-'); myDate = new Date(arys[0], --arys[1], arys[2]); }
//     return myDate;
// }
