/**
 * Created by lcc3536 on 14-7-24.
 */


var heroSkill = (function () {
    return {
        1: function () {
            cc.assert(this.skill.damageProportion != null, "hero skill error, skill id is " + this.skill.id);

            var targets = this.getTargets();
            var len = targets.length;

            for (var i = 0; i < len; ++i) {
                var target = targets[i];

                if (target instanceof Soldier) {
                    var buffId = this.skill.buffId;
                    var buffDuration = this.skill.buffDuration;

                    target.clearBuff(buffId);

                    target.status = STATUS_CONFIG.STIFF;

                    var buffEffect = ccs.Armature.create("buff_" + buffId);
                    buffEffect.y = 120;
                    target.buffNode.addChild(buffEffect);

                    buffEffect.getAnimation().setFrameEventCallFunc(this.onFrameEvent, this);
                    buffEffect.getAnimation().play("default");

                    var func = function (target, buffEffect) {
                        buffEffect.removeFromParent();
                        target.idle();
                    }.bind(this, target, buffEffect);

                    target.addBuff({
                        id: buffId,
                        timestamp: _.now(),
                        duration: buffDuration,
                        func: func
                    });
                }

                var damage = Math.round(this.hero.getDamage() * this.skill.damageProportion / DEFAULT_DENOMINATOR);

                target.hurt(damage, true);
            }
        },
        2: function () {
            cc.assert(this.skill.damageProportion != null, "hero skill error, skill id is " + this.skill.id);

            var targets = this.getTargets();
            var len = targets.length;

            for (var i = 0; i < len; ++i) {
                var damage = Math.round(this.hero.getDamage() * this.skill.damageProportion / DEFAULT_DENOMINATOR);

                targets[i].hurt(damage, true);
            }
        },
        3: function () {
            cc.assert(this.skill.recovery != null, "hero skill error, skill id is " + this.skill.id);

            var targets = this.getTargets();
            var len = targets.length;

            for (var i = 0; i < len; ++i) {
                var recovery = this.skill.recovery;

                if (this.hero.crit != null && this.hero.critMultiple != null) {
                    recovery = recovery * (_.judge(this.hero.crit, DEFAULT_DENOMINATOR) ? this.hero.critMultiple : 1);
                }

                recovery = Math.round(recovery * _.rand(HURT_LOWER_LIMIT, HURT_UPPER_LIMIT));

                targets[i].cure(recovery);
            }
        }
    };
})();