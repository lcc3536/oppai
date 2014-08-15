/**
 * Created by lcc3536 on 14-7-7.
 */


var TeamAI = (function () {
    var SKILL_AI_CONFIG = {
        0: {
            DISTANCE: 83,
            DISTANCE_MIN: 78,
            DISTANCE_MAX: 88,
            DEGREES: 30,
            DEGREES_MIN: 25,
            DEGREES_MAX: 35
        },
        1: {
            DISTANCE: 125,
            DISTANCE_MIN: 100,
            DISTANCE_MAX: 150,
            DEGREES: 40,
            DEGREES_MIN: 35,
            DEGREES_MAX: 45
        },
        2: {
            DISTANCE: 300,
            DISTANCE_MIN: 250,
            DISTANCE_MAX: 400,
            DEGREES: 80,
            DEGREES_MIN: 77,
            DEGREES_MAX: 90
        }
    };

    var REPEAT_FOREVER = -1;

    return cc.ex.Entity.extend({
        team: null,
        id: 0,
        loop: 0,
        actions: null,
        index: 0,
        len: 0,
        nextActionTime: 0,
        idEnd: false,

        ctor: function (args) {
            cc.assert(args.team != null && this.id != null, "team ai ctor args error");

            this.team = args.team;
            this.id = args.id;

            this._load();
        },

        _load: function () {
            cc.assert(this.id != null && AI_CONFIG[this.id] != null, "team ai id error");

            var aiData = cc.clone(AI_CONFIG[this.id]);

            cc.assert(aiData && aiData.ACTIONS, "team ai load error, aiData no exist");

            if (aiData) {
                this.team.heroId = aiData.HERO_ID || null;
                this.loop = aiData.LOOP || 0;
                this.actions = aiData.ACTIONS;
                this.index = 0;
                this.len = this.actions.length;
                this.nextActionTime = _.now();
            }

            this.isEnd = false;
        },

        update: function (dt) {
            var now = _.now();

            if (now >= this.nextActionTime) {
                if (this.index >= this.len) {
                    if (this.loop && (this.loop === REPEAT_FOREVER || this.loop > 0)) {
                        this.index = 0;

                        if (this.loop > 0) {
                            this.loop -= 1;
                        }
                    } else {
                        this.isEnd = true;

                        return;
                    }
                }

                var action = this.actions[this.index++];

                cc.assert(action, "hero ai update error, action no exist");

                this.nextActionTime = now;

                if (action.SKILL != null) {
                    var skillAi = SKILL_AI_CONFIG[action.SKILL];

                    if (this.team.useSkill(action.SKILL,
                        _.rand(skillAi.DISTANCE_MIN, skillAi.DISTANCE_MAX),
                        _.rand(skillAi.DEGREES_MIN, skillAi.DEGREES_MAX))) {
//                        delete  action.SKILL;
                    }
                }

                if (action.SOLDIER != null && this.team.addSoldier(action.SOLDIER)) {
//                    delete  action.SOLDIER;
                }

                if (action.TIME != null) {
                    this.nextActionTime += action.TIME;
                }
            }
        }
    })
})();


CREATE_FUNC(TeamAI);