/**
 * Created by lcc3536 on 14-7-1.
 */


var MainScene = (function () {
    return cc.Scene.extend({
        ctor: function () {
            this._super();

            var mainLayer = MainLayer.create();
            this.addChild(mainLayer);
        }
    });
})();


CREATE_FUNC(MainScene);