/**
 * Created by lcc3536 on 14-6-26.
 */


var HeroAI = (function () {
    return cc.ex.Entity.extend({
        hero: null,
        index: 0,
        len: 0,
        actions: null,
        nextActionTime: 0,

        ctor: function (hero) {
            cc.assert(hero, "hero ai ctor error, hero no exist");

            this.hero = hero;
            this.index = 0;
            this.len = 0;
            this.actions = [];
            this.nextActionTime = _.now();
        },

        update: function (dt) {
            if (this.index < this.len) {
                var now = _.now();

                if (now >= this.nextActionTime) {
                    var action = this.actions[this.index++];

                    cc.assert(action, "hero ai update error, action no exist");

                    this.nextActionTime = now;

                    if (action.skill) {
                        if (this.hero.onLaunchBegan()) {
                            this.hero.onLaunchMove(100, 45);
                            this.hero.onLaunchEnd(100, 45);
                        }
                    }

                    if (action.soldier) {
                        this.hero.sendTroops(action.soldier);
                    }

                    if (action.time) {
                        this.nextActionTime += action.time;
                    }

                }
            }
        }
    });
})();


CREATE_FUNC(HeroAI);