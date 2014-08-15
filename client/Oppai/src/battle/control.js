/**
 * Created by lcc3536 on 14-7-21.
 */


var Control = (function () {
    var LIGHT_ROTATION_CONFIG = [-15, -45, -75];
    var SKILL_PROGRESS_RES_CONFIG = [
        "skill_cd_png",
        "skill_cd_png",
        "skill_cd_png"
    ];
    var SKILL_PROGRESS_POSITION_CONFIG = [
        cc.p(1097, 143),
        cc.p(1028, 104),
        cc.p(994, 35)
    ];
    var SOLDIER_PROGRESS_RES_CONFIG = [
        "soldier_cd1_png",
        "soldier_cd1_png",
        "soldier_cd2_png",
        "soldier_cd2_png",
        "soldier_cd2_png",
        "soldier_cd2_png"
    ];
    var SOLDIER_PROGRESS_POSITION_CONFIG = [
        cc.p(75, 75),
        cc.p(220, 75),
        cc.p(360, 75),
        cc.p(490, 75),
        cc.p(620, 75),
        cc.p(750, 75)
    ];

    return cc.Layer.extend({
        team: null,
        joystick: null,
        control: null,
        skillProgress: null,
//        soldierProgress: null,

        ctor: function (team) {
            this._super();

            cc.assert(team, "control ctor error, team no exist");

            this.team = team;
            this.team.setControl(this);

            this.joystick = Joystick.create(this);
            this.addChild(this.joystick, 0);

            this.control = ccs.uiReader.widgetFromJsonFile(res.battle_ui);
            this.addChild(this.control, 5);

            ccui.helper.seekWidgetByName(this.control, "skill_1").addTouchEventListener(this.touchEvent, this);
            ccui.helper.seekWidgetByName(this.control, "skill_2").addTouchEventListener(this.touchEvent, this);
            ccui.helper.seekWidgetByName(this.control, "skill_3").addTouchEventListener(this.touchEvent, this);
            ccui.helper.seekWidgetByName(this.control, "soldier_1").addTouchEventListener(this.touchEvent, this);
            ccui.helper.seekWidgetByName(this.control, "soldier_2").addTouchEventListener(this.touchEvent, this);
            ccui.helper.seekWidgetByName(this.control, "soldier_3").addTouchEventListener(this.touchEvent, this);
            ccui.helper.seekWidgetByName(this.control, "soldier_4").addTouchEventListener(this.touchEvent, this);
            ccui.helper.seekWidgetByName(this.control, "soldier_5").addTouchEventListener(this.touchEvent, this);

            var len, i, progress;

            if (this.team.hasHero()) {
                this.skillProgress = [];
                len = this.team.hero.getSkillLen();
                for (i = 0; i < len; ++i) {
                    progress = cc.ProgressTimer.create(cc.Sprite.create(res[SKILL_PROGRESS_RES_CONFIG[i]]));
                    progress.setType(cc.ProgressTimer.TYPE_RADIAL);
                    progress.setPosition(SKILL_PROGRESS_POSITION_CONFIG[i]);
                    progress.scaleX = -1;
                    this.addChild(progress, 5);

                    this.skillProgress[i] = progress;
                }
            }

//            this.soldierProgress = [];
//            len = this.team.getSoldiersLen();
//            for (i = 0; i < len; ++i) {
//                progress = cc.ProgressTimer.create(cc.Sprite.create(res[SOLDIER_PROGRESS_RES_CONFIG[i]]));
//                progress.setType(cc.ProgressTimer.TYPE_RADIAL);
//                progress.setPosition(SOLDIER_PROGRESS_POSITION_CONFIG[i]);
//                progress.scaleX = -1;
//                this.addChild(progress, 5);
//
//                this.soldierProgress[i] = progress;
//            }

            this.update();
        },

        update: function (dt) {
            var len, i, flag, index, spCost, spLabel;
            var sp = this.team.getSp();

            ccui.helper.seekWidgetByName(this.control, "sp_label").setString(sp);

            len = this.team.getSoldiersLen();
            for (i = 0; i < len; ++i) {
                index = i + 1;
                spCost = this.team.getSoldierSp(i);

                spLabel = ccui.helper.seekWidgetByName(this.control, "sp_soldier_" + index + "_label");
                spLabel.setString(spCost);

                flag = !this.team.isSoldierExist(i) && (sp >= spCost);
                ccui.helper.seekWidgetByName(this.control, "soldier_" + index + "_icon").visible = flag;
                ccui.helper.seekWidgetByName(this.control, "soldier_" + index + "_icon_d").visible = !flag;

//                this.soldierProgress[i].setPercentage(this.team.getSoldierCdPercent(i));
            }

            var hero = this.team.hero;

            if (hero) {
                ccui.helper.seekWidgetByName(this.control, "light").rotation = LIGHT_ROTATION_CONFIG[hero.getSelectSkill()];

                len = hero.getSkillLen();
                for (i = 0; i < len; ++i) {
                    index = i + 1;
                    spCost = hero.getSkillSp(i);

                    flag = (sp >= spCost);
                    ccui.helper.seekWidgetByName(this.control, "missile_" + index).visible = flag;
                    ccui.helper.seekWidgetByName(this.control, "missile_" + index + "_d").visible = !flag;

                    this.skillProgress[i].setPercentage(hero.getSkillCdPercent(i));
                }
            }
        },

        onLaunchBegan: function () {
            if (this.team.isBegan && this.team.onLaunchBegan()) {
                this.joystick.setLocalZOrder(10);

                return  true;
            }

            return false;
        },

        onLaunchMove: function (distance, degrees) {
            this.team.onLaunchMove(distance, degrees);
        },

        onLaunchEnd: function (distance, degrees) {
            this.joystick.setLocalZOrder(0);

            this.team.onLaunchEnd(distance, degrees);
        },

        onLaunchCancelled: function () {
            this.joystick.setLocalZOrder(0);

            this.team.onLaunchCancelled();
        },

        touchEvent: function (sender, type) {
            if (!this.team.isBegan) {
                return;
            }

            var name = sender.name;

            switch (type) {
                case ccui.Widget.TOUCH_BEGAN:
                    cc.log("Touch Down");
                    break;

                case ccui.Widget.TOUCH_MOVED:
                    cc.log("Touch Move");
                    break;

                case ccui.Widget.TOUCH_ENDED:
                    cc.log(name);

                    if (name === "skill_1") {
                        this.team.selectSkill(0);
                        sound.playEffect(res.skill_button_sound_mp3);
                    } else if (name === "skill_2") {
                        this.team.selectSkill(1);
                        sound.playEffect(res.skill_button_sound_mp3);
                    } else if (name === "skill_3") {
                        this.team.selectSkill(2);
                        sound.playEffect(res.skill_button_sound_mp3);
                    } else if (name === "soldier_1") {
                        this.team.sendTroops(0);
                        sound.playEffect(res.soldier_button_sound_mp3);
                    } else if (name === "soldier_2") {
                        this.team.sendTroops(1);
                        sound.playEffect(res.soldier_button_sound_mp3);
                    } else if (name === "soldier_3") {
                        this.team.sendTroops(2);
                        sound.playEffect(res.soldier_button_sound_mp3);
                    } else if (name === "soldier_4") {
                        this.team.sendTroops(3);
                        sound.playEffect(res.soldier_button_sound_mp3);
                    } else if (name === "soldier_5") {
                        this.team.sendTroops(4);
                        sound.playEffect(res.soldier_button_sound_mp3);
                    } else if (name === "soldier_6") {
                        this.team.sendTroops(5);
                        sound.playEffect(res.soldier_button_sound_mp3);
                    }
                    break;

                case ccui.Widget.TOUCH_CANCELED:
                    cc.log("Touch Cancelled");
                    break;

                default:
                    break;
            }
        },

        over: function (isWin) {
            if (isWin) {
                sound.playEffect(res.battle_win_sound_wav);
            }

            var endLayer = EndLayer.create(isWin);
            this.addChild(endLayer, 1);
        },

        tip: function (str, size, color) {
            size = size || 30;
            color = color || cc.color(255, 255, 255, 255);

            var label = cc.LabelTTF.create(str, "STHeitiTC-Medium", size);
            label.x = cc.winSize.width / 2;
            label.y = cc.winSize.height / 2;
            label.setColor(color);
            this.addChild(label);

            label.runAction(
                cc.Sequence.create(
                    cc.MoveBy.create(1.5, cc.p(0, 80)),
                    cc.CallFunc.create(function () {
                        label.removeFromParent();
                    })
                )
            )
        }
    })
})();


CREATE_FUNC(Control);