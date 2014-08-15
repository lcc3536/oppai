/**
 * Created by lcc3536 on 14-7-10.
 */


var soldierAtk = (function () {
    return {
        1: function () {
            if (this.unit && this.status !== STATUS_CONFIG.DIED) {
                this.unit.hurt(this.getDamage());
            }
        },
        2: function () {
            var unit = this.unit;
            var damage = this.getDamage();

            if (unit && this.status !== STATUS_CONFIG.DIED) {
                var p1 = this.getBullet();
                var p2 = unit.getHitPoint();
                var v = cc.pSub(p2, p1);

                var bullet = ccs.Armature.create("soldier_" + this.resId + "_bullet");
                bullet.scale = Math.abs(this.scaleX);
                bullet.setPosition(p1);
                bullet.setRotationEx(cc.pToAngle(v));
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
        },
        3: function () {
            var unit = this.unit;

            if (unit && this.status !== STATUS_CONFIG.DIED) {
                var p1 = this.getBullet();
                var p2 = cc.p(unit.getHitPoint().x, DEFAULT_FLOOR_HEIGHT);
                var p3 = this.battlefield.convertToWorldSpace(p2);
                var dx = Math.abs(p1.x - p2.x);
                var d = dx / 3;

                var v = cc.pSub(p2, p1);

                var bullet = ccs.Armature.create("soldier_" + this.resId + "_bullet");
                bullet.scale = Math.abs(this.scaleX);
                bullet.setPosition(p1);
                bullet.setRotationEx(cc.pToAngle(v));
                this.battlefield.addChild(bullet, 1);

                bullet.getAnimation().setMovementEventCallFunc(function (armature, movementType, movementID) {
                    if (movementType === ccs.MovementEventType.complete) {
                        if (movementID === "end") {
                            armature.removeFromParent();
                        }
                    }
                }, this);

                bullet.getAnimation().setFrameEventCallFunc(this.onFrameEvent, this);

                var points = [p1, cc.p(p1.x + (p1.x < p2.x ? d : -d), p1.y + d), p2];

                bullet.runAction(
                    cc.Sequence.create(
                        cc.CardinalSplineTo.create(dx / this.range + 0.3, points, 0),
                        cc.CallFunc.create(function () {
                            bullet.setPosition(p2);
                            bullet.getAnimation().play("end");

                            if (!this.battlefield.isEnd) {
                                var team = this.battlefield.getRival(this);

                                var soldiers = team.soldiers;
                                if (soldiers) {
                                    for (var j = 0; j < soldiers.length; ++j) {
                                        var soldier = soldiers[j];

                                        if (op.pToArmatureShorterRange(soldier.soldierArmature,
                                            soldier.soldierArmature.convertToNodeSpace(p3),
                                            this.damageRange)) {
                                            soldier.hurt(this.getDamage());
                                        }
                                    }
                                }

                                var hero = team.hero;
                                if (hero) {
                                    if (op.pToArmatureShorterRange(hero.heroArmature,
                                        hero.heroArmature.convertToNodeSpace(p3),
                                        this.damageRange)) {
                                        hero.hurt(this.getDamage());
                                    }
                                }
                            }
                        }, this)
                    )
                );
            }
        }
    };
})();