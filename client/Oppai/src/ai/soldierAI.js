/**
 * Created by lcc3536 on 14-6-26.
 */


var soldierAI = (function () {
    var SoldierAI = cc.ex.Entity.extend({
        queue: null,

        ctor: function () {
            this.queue = [];
        },

        update: function (dt) {
            var now = _.now();
            var len = this.queue.length;

            for (var i = 0; i < len; ++i) {
                if (now > this.queue[i].nextTime && this.play(this.queue[i].soldier)) {
                    this.queue[i].nextTime = now + _.random(5000, 10000);
                }
            }
        },

        addSoldier: function (soldier) {
            this.queue.push({
                soldier: soldier,
                nextTime: _.now()
            });
        },

        play: function (soldier) {
            cc.assert(soldier, "soldier ai play error, soldier no exist");

            if (soldier.status === STATUS_CONFIG.IDLE) {
                if (_.judge(10, 10)) {
                    soldier.selectSkill(_.random(1, 3));

                    var distance = 100;
                    var degrees = 45;
                    var times = _.random(8, 15);

                    soldier.onLaunchBegan();
                    soldier.onLaunchMove(distance, degrees);

                    this.schedule(function () {
                        times -= 1;

                        distance += _.random(-5, 5);
                        degrees += _.random(-5, 5);

                        if (times) {
                            hero.onLaunchMove(distance, degrees);
                        } else {
                            hero.onLaunchEnd(distance, degrees);
                        }
                    }, _.rand(0.05, 0.08), times);
                } else {

                }

                return true;
            }

            return false;
        }
    });

    return new SoldierAI();
})();