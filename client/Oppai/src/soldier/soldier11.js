/**
 * Created by lcc3536 on 14-6-30.
 */


var Soldier11 = (function () {
    return Soldier.extend({
        _attack: function () {
            var unit = this.unit;
            var damage = this.getDamage();

            if (unit && this.status !== STATUS_CONFIG.DIED) {
                var p1 = this.getBullet();
                var p2 = unit.getHitPoint();
                var v = cc.pSub(p2, p1);

                var bullet = ccs.Armature.create("soldier_6_bullet");
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
                            bullet.setPosition(cc.pAdd(p1, cc.pMult(v, moveDistance / distance)));

                            return true;
                        }
                    } else {
                        bullet.removeFromParent();
                    }

                    return false;
                });
            }
        },

        _skill: function () {
            cc.assert(this.skill && this.skill.damageProportion != null, "soldier 5 skill error");

            var unit = this.unit;
            var damage = Math.round(this.getDamage() * this.skill.damageProportion / DEFAULT_DENOMINATOR);

            if (unit && this.status !== STATUS_CONFIG.DIED) {
                var p1 = this.getBullet();
                var p2 = unit.getHitPoint();
                var v = cc.pSub(p2, p1);

                var bullet = ccs.Armature.create("soldier_6_skill");
                bullet.setPosition(p1);
                if (v.x < 0) {
                    bullet.scaleX = -Math.abs(bullet.scaleX);
                    bullet.setRotationEx(cc.radiansToDegrees(cc.pToAngle(v)) + 180);
                } else {
                    bullet.setRotationEx(cc.radiansToDegrees(cc.pToAngle(v)));
                }
                this.battlefield.addChild(bullet, 1);

                bullet.getAnimation().setMovementEventCallFunc(function (armature, movementType, movementID) {
                    if (movementType === ccs.MovementEventType.complete) {
                        if (movementID === "end") {
                            bullet.removeFromParent();
                        }
                    }
                }, this);

                bullet.getAnimation().setFrameEventCallFunc(function (bone, evt, originFrameIndex, currentFrameIndex) {
                    switch (evt) {
                        case "1":
                            if (unit instanceof Soldier) {
                                unit.updateStatus(STATUS_CONFIG.STIFF);
                                unit.visible = false;
                            }
                            break;
                        case "2":
                            if (unit instanceof Soldier) {
                                unit.x = bullet.x;
                                unit.visible = true;
                            }
                            unit.hurt(damage);
                            break;
                        default :

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
                        } else {
                            if (v.x < 0) {
                                bullet.scaleX = -Math.abs(bullet.scaleX);
                                bullet.setRotationEx(cc.radiansToDegrees(cc.pToAngle(v)) + 180);
                            } else {
                                bullet.setRotationEx(cc.radiansToDegrees(cc.pToAngle(v)));
                            }
                            bullet.setPosition(cc.pAdd(p1, cc.pMult(v, moveDistance / distance)));

                            return true;
                        }
                    } else {
                        unit.visible = true;
                        bullet.removeFromParent();
                    }

                    return false;
                });
            }
        }
    })
})();


CREATE_FUNC(Soldier11);