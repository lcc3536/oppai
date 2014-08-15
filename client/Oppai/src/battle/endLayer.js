/**
 * Created by lcc3536 on 14-7-1.
 */


var EndLayer = (function () {
    return cc.Layer.extend({
        func: null,

        ctor: function (func, str) {
            this._super();

            cc.assert(func && str, "end layer ctor error, func or str no exist");

            this.func = func;

            var label = cc.LabelTTF.create(str, "Times New Roman", 40);
            label.setPosition(cc.winCenter);
            this.addChild(label);

            this._addListener();
        },

        _addListener: function () {
//            if ("touches" in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this._onTouchBegan.bind(this),
                onTouchMoved: this._onTouchMoved.bind(this),
                onTouchEnded: this._onTouchEnded.bind(this),
                onTouchCancelled: this._onTouchCancelled.bind(this)
            }, this);
//            } else {
//                cc.log("TOUCH-ONE-BY-ONE is not supported on desktop");
//            }
        },

        _onTouchBegan: function (touch, event) {
            return true;
        },

        _onTouchMoved: function (touch, event) {
        },

        _onTouchEnded: function (touch, event) {
            if (this.func) {
                this.func();
            }

            this.removeFromParent();
        },

        _onTouchCancelled: function (touch, event) {
        }
    })
})();


CREATE_FUNC(EndLayer);