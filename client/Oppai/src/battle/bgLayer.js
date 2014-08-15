/**
 * Created by lcc3536 on 14-7-18.
 */


var BgLayer = (function () {
    return cc.Layer.extend({
        bgUi: null,
        bgs: null,
        maxWidth: 0,
        action: null,

        onExit: function () {
            this._super();

            this.action.stop();
        },

        ctor: function (bgRes) {
            this._super();

            bgRes = bgRes || res.bg_ui_1_1;

            this._loadBg(bgRes);
        },

        _loadBg: function (bgRes) {
            this.bgUi = ccs.uiReader.widgetFromJsonFile(bgRes);
            this.addChild(this.bgUi);

            this.bgs = [];
            var index = 1;
            while (true) {
                var bg = this.bgUi.getChildByName("bg_" + index++);

                if (bg == null) {
                    break;
                }

                this.bgs.push(bg);
            }

            this.maxWidth = this.bgs[0].width;

            this.action = ccs.actionManager.playActionByName(
                bgRes.slice(bgRes.lastIndexOf("/") + 1),
                "default"
            );
        },

        update: function (dt) {
            var x = this.getParent().x;

            var len = this.bgs.length;

            if (len > 0) {
                var winWidth = cc.winSize.width;
                var maxWidth = this.getMaxWidth();

                var dx = maxWidth - winWidth;

                if (dx > 0) {
                    for (var i = 1; i < len; ++i) {
                        if (this.bgs[i].width > winWidth) {
                            this.bgs[i].x = x / dx * (this.bgs[i].width - winWidth) - x;
                        }
                    }
                }
            }
        },

        getMaxWidth: function () {
            return this.maxWidth;
        }
    })
})();


CREATE_FUNC(BgLayer);