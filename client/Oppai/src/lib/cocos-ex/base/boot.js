/**
 * Created by lcc3536 on 14-6-6.
 */


cc.ex = cc.ex || {};

(function () {
    var list = [];

    cc.ex.addStartFunc = function (func) {
        list.push(func);
    };

    cc.ex.onStart = function () {
        var len = list.length;

        for (var i = 0; i < len; ++i) {
            list[i]();
        }
    };

    cc.ex.addStartFunc(function () {
        cc.winCenter = cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
    });

    cc.ex.addStartFunc(function () {
        cc.Node.prototype.setRotationEx = function (newRotation) {
            this.setRotation((360 - newRotation) % 360);
//        this.rotation = (360 - newRotation) % 360;
        };
    });
})();

