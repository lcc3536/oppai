/**
 * Created by lcc3536 on 14-5-22.
 */


var BattleScene = cc.Scene.extend({
    _battleLayer: null,
    _hudLayer: null,

    onEnter: function() {
        this._super();

        cc.PhysicsSprite.create();
        cc.PhysicsDebugNode.create();
    },

    init: function () {
        cc.log("BattleScene init");

        if (!this._super()) return false;

        this._battleLayer = null;
        this._hudLayer = null;

        this._battleLayer = BattleLayer.create();
        this.addChild(this._battleLayer);

        this._hudLayer = HudLayer.create();
        this.addChild(this._hudLayer, 1);

        return true;
    }
});


CREATE_FUNC(BattleScene);