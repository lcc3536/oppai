/**
 * Created by lcc3536 on 14-6-9.
 */


var BattleScene = (function () {
    var SHOCK_BONE_NAME = "shock";
    var SHOCK_ACTION_TAR = 234590;

    return cc.Scene.extend({
        id: 0,
        pass: null,
        index: 0,
        len: 0,
        team: null,
        battlefield: null,
        shockEventTag: null,

        onEnter: function () {
            this._super();

            this.shockEventTag = op.addFrameEvent(this._shockFrameEvent.bind(this));

            sound.playMusic(res.battle_bgm_mp3, true);
        },

        onExit: function () {
            this._super();

            if (ccs.actionManager.releaseActions) {
                ccs.actionManager.releaseActions();
            }

            if (this.shockEventTag != null) {
                op.removeFrameEvent(this.shockEventTag);
            }

            sound.stopMusic();
        },

        ctor: function (id) {
            this._super();

            cc.assert(id != null, "battle scene ctor error, id no exist");

            this.id = id;
            this.pass = PASS_CONFIG[this.id].DETAIL;
            this.index = 0;
            this.len = this.pass.length;
            this.team = this.newTeam();
            this.battlefield = null;
            this.shockEventTag = null;

            var timestamp = _.now();
            var timeLabel = cc.LabelTTF.create("0 : 0", "Times New Roman", 20);
            timeLabel.x = 50;
            timeLabel.y = 620;
            this.addChild(timeLabel, 10);

            this.schedule(function () {
                var interval = Math.floor((_.now() - timestamp) / MILLISECONDS_TO_SECONDS);
                timeLabel.setString(Math.floor(interval / 60) + " : " + (interval % 60));
            });

            this._next();
        },

        next: function (isWin) {
            var func, str;

            if (isWin) {
                func = this._next.bind(this);

                if (this.index < this.len) {
                    str = "点击进入下一关";
                } else {
                    str = "赢了。。嘿嘿";
                }
            } else {
                func = this._end.bind(this);
                str = "输了。。嘿嘿";
            }

            var endLayer = EndLayer.create(func, str);
            this.addChild(endLayer, 1);
        },

        _next: function () {
            if (this.index < this.len && this.pass[this.index] && this.team) {
                var pass = this.pass[this.index];

                var team2 = Team.create({
                    type: TEAM_TYPE_CONFIG.ENEMY,
                    aiId: pass.AI_ID
                });

                var battlefield = Battlefield.create({
                    acceleration: DEFAULT_ACCELERATION,
                    bgRes: pass.BG_RES,
                    team1: this.team,
                    team2: team2
                });
                this.addChild(battlefield);

                if (this.battlefield) {
                    this.battlefield.removeFromParent();
                }

                this.battlefield = battlefield;

                this.index += 1;
            } else {
                this._end();
            }
        },

        _end: function () {
            cc.director.runScene(MainScene.create());
        },

        newTeam: function () {
            var team = Team.create({
                type: TEAM_TYPE_CONFIG.OWN,
                heroId: 1,
                soldiersId: [1, 2, 3, 4, 5]
            });

            var control = Control.create(team);
            this.addChild(control, 1);

            return team;
        },

        _shockFrameEvent: function (bone, evt, originFrameIndex, currentFrameIndex) {
            if (bone.name == SHOCK_BONE_NAME && this.battlefield) {
                var param = evt.split("_");

                if (param && param.length == 4) {
                    this.battlefield.stopActionByTag(SHOCK_ACTION_TAR);
                    this.battlefield.y = 0;

                    var distance = parseInt(param[0]);
                    var duration = parseInt(param[1]) / MILLISECONDS_TO_SECONDS;
                    var times = parseInt(param[2]);
                    var next = parseInt(param[3]);

                    var perDuration = duration / times;

                    var actions = [];

                    for (var i = 0; i < times; ++i) {
                        actions.push(cc.MoveBy.create(perDuration / 4, cc.p(0, distance)));
                        actions.push(cc.MoveBy.create(perDuration / 2, cc.p(0, -(distance + distance))));
                        actions.push(cc.MoveBy.create(perDuration / 4, cc.p(0, distance)));

                        distance += next;
                    }

                    var shock = cc.Sequence.create(actions);
                    shock.setTag(SHOCK_ACTION_TAR);

                    this.battlefield.runAction(shock);
                } else {
                    cc.warn(evt);
                }
            }
        }
    });
})();


CREATE_FUNC(BattleScene);