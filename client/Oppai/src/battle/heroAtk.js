/**
 * Created by lcc3536 on 14-7-10.
 */


var heroAtk = (function () {
    return {
        1: function () {
            var damage = Math.round(this.getDamage() * this.damageProportion / DEFAULT_DENOMINATOR);

            if (this.status !== STATUS_CONFIG.DIED) {
                var point = this.getBullet();

                var bullet = ccs.Armature.create("hero_" + this.id + "_bullet");
                bullet.setPosition(point);
                this.battlefield.addChild(bullet, 1);

                bullet.getAnimation().setMovementEventCallFunc(function (armature, movementType, movementID) {
                    if (movementType === ccs.MovementEventType.complete) {
                        if (movementID === "end") {
                            armature.removeFromParent();
                        }
                    }
                }, this);
                bullet.getAnimation().setFrameEventCallFunc(this.onFrameEvent, this);

                bullet.getAnimation().play("move");

                this.addUpdateFunc(function (dt) {
                    var p1 = bullet.getPosition();

                    if (this.battlefield.isEnd || Math.abs(point.x - p1.x) > this.range) {
                        bullet.removeFromParent();
                        return false;
                    }

                    var moveDistance = this.trajectory * dt;

                    var unit = this.battlefield.getNextAtkUnit(this);
                    if (unit) {
                        var p2 = unit.getHitPoint();

                        var distance = Math.abs(p1.x - p2.x);

                        if (distance < moveDistance) {
                            bullet.x = p2.x;
                            bullet.getAnimation().play("end");
                            unit.hurt(damage);

                            return false;
                        }
                    }

                    bullet.x += (this.type === TEAM_TYPE_CONFIG.OWN ? moveDistance : -moveDistance);

                    return true;
                });
            }
        }
    };
})();