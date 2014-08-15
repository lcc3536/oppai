/**
 * Created by lcc3536 on 14-6-28.
 */


var Soldier1 = (function () {
    return Soldier.extend({
        _attack: function () {
            if (this.unit && this.status !== STATUS_CONFIG.DIED) {
                this.unit.hurt(this.getDamage());
            }
        }
    });
})();


CREATE_FUNC(Soldier1);