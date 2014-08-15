/**
 * Created by lcc3536 on 14-5-22.
 */


var CREATE_FUNC = function (__CLASS__) {
    __CLASS__.create = function (args) {
        var ret = Object.create(__CLASS__.prototype);

        ret = __CLASS__.apply(ret, arguments) || ret;

        if (ret) {
            if (ret.hasOwnProperty("init")) {
                if (ret.init.apply(ret, arguments) !== false) {
                    return ret;
                }
            }

            return ret
        }

        return null;
    };
};

var GET_CLASS = function (__CLASS_NAME__) {
    var __CLASS__ = null;

    try {
        __CLASS__ = eval(__CLASS_NAME__);
    } catch (e) {
        cc.log(e);
    }

    return __CLASS__;
};


cc.ex = cc.ex || {};

cc.ex.CREATE_FUNC = CREATE_FUNC;
cc.ex.GET_CLASS = GET_CLASS;