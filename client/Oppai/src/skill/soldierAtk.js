/**
 * Created by lcc3536 on 14-6-27.
 */


var soldierAtk = (function () {
    var atk = {
        1: function (soldier) {
            var unit = soldier.unit;

            var damage = soldier.damage;

            unit.hurt(damage);
        },
        2: function (soldier) {
            var battlefield = soldier.battlefield;
            var unit = soldier.unit;
            var damage = soldier.damage;
            var trajectory = soldier.trajectory;

            var bullet = ccs.Armature.create("hero_1_bullet");
            bullet.setPosition(soldier.getBullet());
            battlefield.addChild(bullet, 1);

            bullet.getAnimation().setFrameEventCallFunc(this.onFrameEvent, this);

            var updateFunc = function (dt) {
                if (!soldier || soldier.status === STATUS_CONFIG.DIED) {
                    bullet.removeFromParent();
                    return false;
                }

                if (!unit || unit.status === STATUS_CONFIG.DIED) {
                    bullet.removeFromParent();
                    return false;
                }

                var p1 = bullet.getPosition();
                var p2 = unit.getHitPoint();

                var v = cc.pSub(p2, p1);

                var distance = cc.pLength(v);
                var moveDistance = trajectory * dt;

                if (distance < moveDistance) {
                    bullet.setPosition(p2);
                    bullet.removeFromParent();
                    unit.hurt(damage);

                    return false;
                } else {
                    bullet.setPosition(cc.pAdd(p1, cc.pMult(v, moveDistance / distance)));
                }

                return true;
            };

            soldier.addUpdateFunc(updateFunc);
        }
    };

    return function (id, soldier) {
        cc.assert(atk[id], "the soldier atk no exist");

        atk[id](soldier);
    };
})();