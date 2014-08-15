/**
 * Created by lcc3536 on 14-7-10.
 */


var soldierSkill = (function () {
    return {
        1: function () {
            cc.assert(this.skill && this.skill.damageProportion != null, "soldier skill error, soldier id is " + this.id);

            var unit = this.unit;
            var damage = Math.round(this.getDamage() * this.skill.damageProportion / DEFAULT_DENOMINATOR);

            if (unit && this.status !== STATUS_CONFIG.DIED) {
                unit.hurt(damage);
            }
        },
        2: function () {
            cc.assert(this.skill && this.skill.damageProportion != null, "soldier skill error, soldier id is " + this.id);

            var unit = this.unit;
            var damage = Math.round(this.getDamage() * this.skill.damageProportion / DEFAULT_DENOMINATOR);

            if (unit && this.status !== STATUS_CONFIG.DIED) {
                var p1 = this.getBullet();
                var p2 = unit.getHitPoint();
                var v = cc.pSub(p2, p1);

                var bullet = ccs.Armature.create("soldier_" + this.resId + "_skill");
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
                            armature.removeFromParent();
                        }
                    }
                }, this);

                bullet.getAnimation().setFrameEventCallFunc(this.onFrameEvent, this);

                bullet.getAnimation().setFrameEventCallFunc(function (bone, evt, originFrameIndex, currentFrameIndex) {
                    switch (evt) {
                        case "1":
                            if (unit instanceof Soldier) {
                                unit.updateStatus(STATUS_CONFIG.STIFF);
                                unit.soldierArmature.visible = false;
                            }
                            break;
                        case "2":
                            if (unit instanceof Soldier) {
                                unit.x = bullet.x;
                                unit.soldierArmature.visible = true;
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
        },
        3: function () {
            cc.assert(this.skill && this.skill.damageProportion != null, "soldier skill error, soldier id is " + this.id);

            if (this.status !== STATUS_CONFIG.DIED) {
                var units = this.team.soldiers;
                var len = units.length;

                for (var i = 0; i < len; ++i) {
                    var unit = units[i];

                    if (unit && unit.status !== STATUS_CONFIG.DIED) {
                        var buffEffect = ccs.Armature.create("soldier_" + this.resId + "_skill");
                        unit.buffNode.addChild(buffEffect);

                        buffEffect.getAnimation().setMovementEventCallFunc(function (armature, movementType, movementID) {
                            if (movementType === ccs.MovementEventType.complete) {
                                if (movementID === "end") {
                                    armature.removeFromParent();
                                }
                            }
                        }, this);

                        buffEffect.getAnimation().setFrameEventCallFunc(this.onFrameEvent, this);

                        buffEffect.getAnimation().play("end");

                        var recovery = Math.round(this.getDamage() * this.skill.damageProportion / DEFAULT_DENOMINATOR);
                        unit.cure(recovery);
                    }
                }
            }
        }
    };
})();