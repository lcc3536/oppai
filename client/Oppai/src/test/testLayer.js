/**
 * Created by lcc3536 on 14-6-26.
 */


var TestLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        cc.log(1);

        ccs.armatureDataManager.addArmatureFileInfo("res/missile_2/missile_2.ExportJson");

        cc.log(2);

        this.missile = ccs.Armature.create("missile_2");
        this.missile.setPosition(cc.p(cc.winSize.width / 3, cc.winSize.height / 2));

        cc.log(3);

        this.addChild(this.missile);

        cc.log(4);

        this.missile.getAnimation().play("end");

        cc.log(5);


        ccs.armatureDataManager.addArmatureFileInfo("res/missile_1/missile_1.ExportJson");

        cc.log(6);

        this.missile = ccs.Armature.create("missile_1");
        this.missile.setPosition(cc.p(cc.winSize.width / 1.5, cc.winSize.height / 2));

        cc.log(7);

        this.addChild(this.missile);

        cc.log(8);

        this.missile.getAnimation().play("end");

        cc.log(9);
    }
});

TestLayer.getScene = function () {
    var scene = cc.Scene.create();

    var testLayer = new TestLayer();

    scene.addChild(testLayer);

    return scene;
};