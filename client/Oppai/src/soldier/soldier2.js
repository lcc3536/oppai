/**
 * Created by lcc3536 on 14-6-30.
 */


var Soldier2 = (function () {
    return Soldier.extend({
        _attack: function () {
            var unit = this.unit;
            var damage = this.getDamage();

            if (unit && this.status !== STATUS_CONFIG.DIED) {
                var p1 = this.getBullet();
                var p2 = unit.getHitPoint();
                var v = cc.pSub(p2, p1);

                var bullet = ccs.Armature.create("soldier_2_bullet");
                bullet.setPosition(p1);
                bullet.setRotationEx(cc.pToAngle(v));
                this.battlefield.addChild(bullet, 1);

                bullet.getAnimation().setMovementEventCallFunc(function (armature, movementType, movementID) {
                    if (movementType === ccs.MovementEventType.complete) {
                        if (movementID === "end") {
                            bullet.removeFromParent();
                        }
                    }
                }, this);
                bullet.getAnimation().play("move");

                this.addUpdateFunc(function (dt) {
                    if (this.battlefield && !this.battlefield.isEnd && unit && unit.status !== STATUS_CONFIG.DIED) {
                        var p1 = bullet.getPosition();
                        var p2 = unit.getHitPoint();

                        var v = cc.pSub(p2, p1);

                        var distance = cc.pLength(v);
                        var moveDistance = this.trajectory * dt;

                        if (distance < moveDistance) {
                            bullet.setPosition(p2);
                            bullet.getAnimation().play("end");
                            unit.hurt(damage);
                        } else {
                            bullet.setRotationEx(cc.radiansToDegrees(cc.pToAngle(v)));
                            bullet.setPosition(cc.pAdd(p1, cc.pMult(v, moveDistance / distance)));

                            return true;
                        }
                    } else {
                        bullet.removeFromParent();
                    }

                    return false;
                });
            }
        }
    });
})();


CREATE_FUNC(Soldier2);