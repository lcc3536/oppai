/**
 * Created by lcc3536 on 14-7-30.
 */


var op = op || {};

(function () {
    var events = [];

    op.addFrameEvent = function (func) {
        return (events.push(func) - 1);
    };

    op.removeFrameEvent = function (funcOrTag) {
        if (typeof (funcOrTag) == "number") {
            if (events[funcOrTag]) {
                events.splice(funcOrTag, 1);
            }

            return;
        }

        var len = events.length;

        for (var i = 0; i < len; ++i) {
            if (events[i] == funcOrTag) {
                events.splice(i, 1);
                return;
            }
        }
    };

    cc.Node.prototype.onFrameEvent = function (bone, evt, originFrameIndex, currentFrameIndex) {
        var len = events.length;

        for (var i = 0; i < len; ++i) {
            events[i](bone, evt, originFrameIndex, currentFrameIndex);
        }
    };
})();