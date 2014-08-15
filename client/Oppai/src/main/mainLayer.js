/**
 * Created by lcc3536 on 14-7-1.
 */


var MainLayer = (function () {
    return cc.Layer.extend({
        ctor: function () {
            this._super();

            var menu = cc.Menu.create();
            this.addChild(menu);


            var len = Object.keys(PASS_CONFIG).length;
            var i = 1;

            for (var key in PASS_CONFIG) {
                var battleItem = cc.MenuItemFont.create(
                    PASS_CONFIG[key].TITLE,
                    this._onStartBattle(key),
                    this
                );
                battleItem.setFontSize(40);
                battleItem.y = ((len + 1) / 2 - i) * 70;
                menu.addChild(battleItem);

                i += 1;
            }

            var FPSItem = cc.MenuItemFont.create(
                "调试 (ON / OFF)",
                this._onClickFPS,
                this
            );
            FPSItem.setFontSize(25);
            FPSItem.x = -470;
            FPSItem.y = 290;
            menu.addChild(FPSItem);
        },

        _onClickFPS: function (sender) {
            cc.director.setDisplayStats(!cc.director.isDisplayStats());
        },

        _onStartBattle: function (id) {
            return function () {
                cc.director.runScene(BattleScene.create(id));
            }
        }
    })
})();


CREATE_FUNC(MainLayer);