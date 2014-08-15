/**
 * Created by lcc3536 on 14-6-30.
 */


var Soldier5 = (function () {
    return Soldier.extend({
        _attack: function () {
            if (this.unit && this.status !== STATUS_CONFIG.DIED) {
                this.unit.hurt(this.getDamage());
            }
        },

        _skill: function () {
            cc.assert(this.skill && this.skill.damageProportion != null, "soldier 5 skill error");

            var unit = this.unit;
            var damage = Math.round(this.getDamage() * this.skill.damageProportion / DEFAULT_DENOMINATOR);

            if (unit && this.status !== STATUS_CONFIG.DIED) {
                unit.hurt(damage);
            }
        }
    });
})();


CREATE_FUNC(Soldier5);