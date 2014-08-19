/**
 * Created by lcc3536 on 14-6-12.
 */


var Soldier = (function () {
    return cc.Node.extend({
        status: STATUS_CONFIG.DEFAULT,
        type: TEAM_TYPE_CONFIG.DEFAULT,
        buffs: null,
        buffNode: null,
        battlefield: null,
        team: null,
        id: 0,
        resId: 0,
        maxHp: 0,
        hp: 0,
        damage: 0,
        crit: 0,
        dodge: 0,
        speed: 0,
        altitude: 0,
        skill: null,
        soldierArmature: null,
        soldierAnimation: null,
        nextAtkTime: 0,
        atkCount: 0,
        skillCount: 0,
        unit: null,
        blood: null,
        bloodHidTime: null,
        greedBlood: null,
        yellowBlood: null,
        markSprite: null,
        position: null, //位置
        targetZ: 0,     //目标Z坐标
        isBegan: false,

        ctor: function (args) {
            this._super();

            cc.assert(args && args.type != null && args.team != null && args.id != null, "soldier ctor args error");

            this.type = args.type;
            this.buffs = {};
            this.battlefield = args.battlefield;
            this.team = args.team;
            this.id = args.id;
            this.atkCount = 0;
            this.skillCount = 0;

            this.load();
            this.loadSkill();

            this.buffNode = new cc.Node();
            this.addChild(this.buffNode);

            this.markSprite = new cc.Sprite(res.target_png);
            this.markSprite.visible = false;
            this.addChild(this.markSprite);

            this.soldierArmature = ccs.Armature.create("soldier_" + this.resId);
            this.soldierAnimation = this.soldierArmature.getAnimation();
            this.soldierAnimation.setMovementEventCallFunc(this.animationEvent, this);
            this.soldierAnimation.setFrameEventCallFunc(this.onFrameEvent, this);
            this.addChild(this.soldierArmature);

            if (this.type === TEAM_TYPE_CONFIG.ENEMY) {
                this.scaleX = -this.scaleX;
            }

            this.blood = ccs.uiReader.widgetFromJsonFile(res.blood_ui);
            this.blood.setPosition(cc.pAdd(this.getBloodPoint(), cc.p(0, 60)));
            this.blood.scaleX = this.scaleX * 0.7;
            this.blood.scaleY = this.scaleY * 0.7;
            this.blood.visible = false;
            this.addChild(this.blood);

            this.bloodHidTime = _.now();
            this.greedBlood = ccui.helper.seekWidgetByName(this.blood, "blood_green");
            this.yellowBlood = ccui.helper.seekWidgetByName(this.blood, "blood_yellow");

            var percent = this.getHpPercent();
            this.greedBlood.setPercent(percent);
            this.yellowBlood.setPercent(percent);

            this.position = {x: 0, y: 0, z: 0};
            this.targetZ = 0;

            if (cc.game.config[cc.game.CONFIG_KEY.debugMode] == cc.game.DEBUG_MODE_INFO) {
                this.drawNode = cc.DrawNode.create();
                this.addChild(this.drawNode, 10);
            }
        },

        addToBattlefield: function (battlefield) {
            var flag = false;

            if (this.battlefield) {
                this.retain();
                this.removeFromParent(false);

                flag = true;
            }

            this.battlefield = battlefield;

            this.nextAtkTime = _.now();
            this.unit = null;
            this.isBegan = false;

            var point = this.team.getSoldierPoint();
            this.position.x = point.x;
            this.position.y = point.y;
            this.y += this.altitude;
            this.battlefield.addChild(this);

            if (flag) {
                this.release();
            }

            this.idle();
        },

        load: function () {
            var soldierData = SOLDIER_CONFIG[this.id];

            cc.assert(soldierData, "soldier load error, soldier data not exist");

            op.attr(this, soldierData);

            this.scale = this.size;
            this.hp = this.maxHp;
        },

        loadSkill: function () {
            this.skill = null;

            if (this.skillId != null) {
                var skillData = SOLDIER_SKILL_CONFIG[this.skillId];

                cc.assert(skillData, "soldier load skill error, skill data no exist, skill id is " + this.skillId);

                this.skill = op.attr({}, skillData);

                this.skill.loopInterval += 1;
            }
        },

        update: function (dt) {
            this._draw();

            this._updateStatus(dt);
            this._updateBuff(dt);
            this._updateBlood(dt);
            this._updatePosition();
        },

        _updateStatus: function (dt) {
            if (this.status === STATUS_CONFIG.IDLE || this.status === STATUS_CONFIG.MOVE) {
                var point = this.getHitPoint();
                var scaleX = Math.abs(this.scaleX);

                var x = this.team.getSoldierCriticalPoint().x;
                if (this.type === TEAM_TYPE_CONFIG.OWN) {
                    this.isBegan = x < point.x;
                }
                if (this.type === TEAM_TYPE_CONFIG.ENEMY) {
                    this.isBegan = x > point.x;
                }

                if (this.isBegan) {
                    var nextAtkUnit = this.battlefield.getNextAtkUnit(this);

                    if (nextAtkUnit) {
                        var nextAtkUnitPoint = nextAtkUnit.getHitPoint();
                        var distance = Math.abs(point.x - nextAtkUnitPoint.x);

                        if (Math.abs(point.x - nextAtkUnitPoint.x) > DISTANCE_EPSILON) {
                            if (point.x < nextAtkUnitPoint.x) {
                                this.scaleX = scaleX;
                            } else if (point.x > nextAtkUnitPoint.x) {
                                this.scaleX = -scaleX;
                            }
                        }

                        if (this.range < distance) {
                            this.move(dt);
                        } else {
                            this.unit = nextAtkUnit;
                            this.attack(dt);
                        }

                        return;
                    }
                }

                this.scaleX = this.type === TEAM_TYPE_CONFIG.OWN ? scaleX : -scaleX;
                this.move(dt);
            }
        },

        _updateBuff: function (dt) {
            var now = _.now();

            for (var key in this.buffs) {
                var buff = this.buffs[key];

                var len = buff.length;

                for (var i = 0; i < len; ++i) {
                    if (buff[i].timestamp + buff[i].duration <= now) {
                        if (buff[i].func) {
                            buff[i].func();
                        }

                        buff.splice(i, 1);

                        i -= 1;
                        len -= 1;
                    }
                }
            }
        },

        _updateBlood: function (dt) {
            this.blood.scaleX = this.scaleX * 0.7;

            var now = _.now();

            var percent = this.getHpPercent();
            var yellowBloodPercent = this.yellowBlood.getPercent();

            if (yellowBloodPercent != percent) {
                this.greedBlood.setPercent(percent);

                if (yellowBloodPercent > percent) {
                    this.yellowBlood.setPercent(Math.max(yellowBloodPercent - BLOOD_PERCENT_GROWTH_RATE * dt, percent));
                } else {
                    this.yellowBlood.setPercent(percent);
                }
            }

            if (this.blood.visible && now > this.bloodHidTime) {
                this.blood.visible = false;
            }
        },

        _draw: function (ctx) {
            if (this.drawNode) {
                this.drawNode.clear();
            }

            if (cc.game.config[cc.game.CONFIG_KEY.debugMode] == cc.game.DEBUG_MODE_INFO) {
                var dict = this.soldierArmature.getBoneDic();
                for (var key in dict) {
                    var bone = dict[key];
                    var bodyList = bone.getColliderBodyList() || [];
                    for (var i = 0; i < bodyList.length; i++) {
                        var body = bodyList[i];
                        var vertexList = body.getCalculatedVertexList();
                        this.drawNode.drawPoly(vertexList);
                    }
                }
            }
        },

        checkMissile: function (missile) {
            var point = this.soldierArmature.convertToNodeSpace(
                missile.convertToWorldSpace(cc.p(0, 0))
            );

            if (op.pInArmature(this.soldierArmature, point)) {
                missile.unit = this;

                return true;
            }

            return false;
        },

        judgeMissile: function (missile) {
            if (missile.unit && missile.unit === this) {
                return this;
            }

            var point = this.soldierArmature.convertToNodeSpace(
                missile.convertToWorldSpace(cc.p(0, 0))
            );

            if (op.pToArmatureShorterRange(this.soldierArmature, point, missile.range)) {
                return this;
            }

            return null;
        },

        updateStatus: function (status, replay) {
            this.status = status;

            var nowMovementID = STATUS_TO_MOVEMENT_ID[this.status];

            if (nowMovementID) {
                if (replay) {
                    this.soldierAnimation.play(nowMovementID);
                } else {
                    var currentMovementID = this.soldierAnimation.getCurrentMovementID();

                    if (!currentMovementID || currentMovementID !== nowMovementID) {
                        this.soldierAnimation.play(nowMovementID);
                    }
                }
            } else {
                this.soldierAnimation.stop();
            }
        },

        began: function () {
            if (this.status === STATUS_CONFIG.DEFAULT) {
                this.updateStatus(STATUS_CONFIG.BEGAN);
            }
        },

        idle: function () {
            this.unit = null;
            this.updateStatus(STATUS_CONFIG.IDLE);
        },

        move: function (dt) {
            var x = this.speed * dt;
            if (this.scaleX < 0) {
                this.position.x -= x;
            } else {
                this.position.x += x;
            }

            if (this.position.z != this.targetZ) {
                var speedZ = this.position.z > this.targetZ ? -50 : 50;
                if (Math.abs(speedZ * dt) > Math.abs(this.position.z - this.targetZ)) {
                    this.position.z = this.targetZ;
                } else {
                    this.position.z += speedZ * dt;
                }
            }
            this._updateZOrder();
            this.updateStatus(STATUS_CONFIG.MOVE);
        },

        _updatePosition: function () {
            this.setPosition(cc.p(this.position.x, this.position.y + this.position.z * 0.5));
        },

        _updateZOrder: function () {
            this.setLocalZOrder(-this.position.z + 100);
        },

        attack: function (dt) {
            var now = _.now();

            if (now > this.nextAtkTime) {
                if (this.skill) {
                    if ((this.atkCount - this.skill.firstInterval) % this.skill.loopInterval === 0) {
                        this.status = STATUS_CONFIG.ATTACK;
                        this.soldierAnimation.play("skill");

                        this.nextAtkTime = now + this.interval;
                        this.atkCount += 1;
                        this.skillCount += 1;

                        return;
                    }
                }

                this.updateStatus(STATUS_CONFIG.ATTACK, true);

                this.nextAtkTime = now + this.interval;
                this.atkCount += 1;

                return;
            }

            this.idle();
        },

        hurt: function (damage, isHeroAtk) {
            if (this.status !== STATUS_CONFIG.DIED) {
                if (isHeroAtk) {
                    this._hurtForHero(damage);
                } else {
                    this._hurtForSoldier(damage);
                }
            }
        },

        died: function () {
            this.hp = 0;

            this.battlefield.getRival(this).addSp(this.spOutput);
            this._tip("+" + this.spOutput, cc.color(17, 244, 187), 1.5);

            this.updateStatus(STATUS_CONFIG.DIED);
        },

        _hurtForHero: function (damage) {
            if (this.status === STATUS_CONFIG.STIFF) {
                this.soldierAnimation.play(STATUS_TO_MOVEMENT_ID[STATUS_CONFIG.HURT]);
            } else {
                this.updateStatus(STATUS_CONFIG.HURT, true);
            }

            this._hurt(damage);
        },

        _hurtForSoldier: function (damage) {
            if (this.status === STATUS_CONFIG.ATTACK) {
                this.soldierArmature.stopAllActions();

                this.soldierArmature.runAction(
                    cc.Sequence.create(
                        cc.TintTo.create(0.1, 255, 0, 0),
                        cc.TintTo.create(0.2, 255, 255, 255)
                    )
                );

                this._hurt(damage);
            } else {
                this._hurtForHero(damage);
            }
        },

        _hurt: function (damage) {
            this.hp = Math.max(this.hp - damage, 0);

            this._tip(damage, cc.color(255, 0, 0, 255));
            this._showBlood();

            if (this.hp <= 0) {
                this.died();
            }
        },

        cure: function (hp) {
            this.hp += hp;

            this.hp = Math.min(this.hp, this.maxHp);
            this.hp = Math.max(this.hp, 0);

            this._tip("+" + hp, cc.color(0, 255, 0, 255));
            this._showBlood();
        },

        _tip: function (str, color, scale) {
            color = color || cc.color(255, 255, 255, 255);
            scale = scale || 1;

            var bloodLabel = ccs.uiReader.widgetFromJsonFile(res.blood_front_ui);
            bloodLabel.attr({
                scaleX: this.scaleX,
                scaleY: this.scaleY
            });
            bloodLabel.setPosition(this.getBloodPoint());
            this.addChild(bloodLabel);

            var label = ccui.helper.seekWidgetByName(bloodLabel, "label");

            label.setString(str);
            label.setColor(color);
            label.setFontSize(label.getFontSize() * scale);

            bloodLabel.runAction(
                cc.Sequence.create(
                    cc.MoveBy.create(0.8, cc.p(0, 50)),
                    cc.CallFunc.create(function () {
                        bloodLabel.removeFromParent();
                    }, this)
                )
            );
        },

        _showBlood: function () {
            this.blood.visible = true;
            this.bloodHidTime = _.now() + BLOOD_SHOW_TIME;
        },

        setHitMark: function (mark) {
            this.markSprite.visible = !!mark;
        },

        getDamage: function () {
            var damage = this.damage;

            if (this.crit != null && this.critMultiple != null) {
                damage = damage * (_.judge(this.crit, DEFAULT_DENOMINATOR) ? this.critMultiple : 1);
            }

            damage = Math.round(damage * _.rand(HURT_LOWER_LIMIT, HURT_UPPER_LIMIT));

            return damage;
        },

        getHpPercent: function () {
            return this.hp / this.maxHp * 100;
        },

        addUpdateFunc: function (func) {
            this.battlefield.addUpdateFunc(func.bind(this));
        },

        addBuff: function (buff) {
            cc.assert(buff && buff.id != null, "soldier add buff error");

            var id = buff.id;

            if (!this.buffs[id]) {
                this.buffs[id] = [];
            }

            this.buffs[id].push(buff);
        },

        getBuff: function (id) {
            if (id == null) {
                return this.buffs;
            }

            return this.buffs[id];
        },

        clearBuff: function (id) {
            if (id != null) {
                this._clearBuff(id);
            } else {
                for (var key in this.buffs) {
                    this._clearBuff(key);
                }
            }
        },

        _clearBuff: function (id) {
            cc.assert(id != null, "soldier clear buff error");

            var buff = this.buffs[id];

            if (buff) {
                var len = buff.length;

                for (var i = 0; i < len; ++i) {
                    if (buff[i] && buff[i].func) {
                        buff[i].func();
                    }
                }

                delete this.buffs[id];
            }
        },

        over: function (isWin) {
            this.blood.visible = false;

            this.clearBuff();

            if (isWin) {
                this.cure(this.recovery);

                this.status = STATUS_CONFIG.STIFF;
                this.soldierAnimation.play("win");
            }
        },

        getPoint: function () {
            return this.battlefield.convertToNodeSpace(this.soldierArmature.convertToWorldSpace(cc.p(0, 0)));
        },

        getHitNode: function () {
            return this.soldierArmature.getBone("hit");
        },

        getHitPoint: function () {
            var point = this.convertToNodeSpace(this.getHitNode().convertToWorldSpace(cc.p(0, 0)));

            if (cc.sys.isNative) {
                point.x *= this.scaleX;
                point.y *= this.scaleY;
            }

            return this.battlefield.convertToNodeSpace(this.convertToWorldSpace(point))
        },

        getBullet: function () {
            var point = this.convertToNodeSpace(this.soldierArmature.getBone("bullet").convertToWorldSpace(cc.p(0, 0)));

            if (cc.sys.isNative) {
                point.x *= this.scaleX;
                point.y *= this.scaleY;
            }

            return this.battlefield.convertToNodeSpace(this.convertToWorldSpace(point));
        },

        getBloodPoint: function () {
            var point = this.convertToNodeSpace(this.soldierArmature.getBone("blood_node").convertToWorldSpace(cc.p(0, 0)));

            if (cc.sys.isNative) {
                point.x *= this.scaleX;
                point.y *= this.scaleY;
            }

            return point;
        },

        isAirUnit: function () {
            return (this.altitude > 0);
        },

        isGroundUnit: function () {
            return (this.altitude <= 0);
        },

        onFrameEvent: function (bone, evt, originFrameIndex, currentFrameIndex) {
            this._super(bone, evt, originFrameIndex, currentFrameIndex);

            switch (evt) {
                case "attack" :
                    cc.assert(this.atkId != null && soldierAtk[this.atkId] != null,
                            "soldier atk error, atk id is " + this.atkId);
                    soldierAtk[this.atkId].bind(this)();
                    break;
                case "skill":
                    cc.assert(this.skillId != null && soldierSkill[this.skillId] != null,
                            "soldier skill error, skill id is " + this.skillId);
                    soldierSkill[this.skillId].bind(this)();
                    break;
                default :
            }
        },

        animationEvent: function (armature, movementType, movementID) {
            this._animationEvent[movementType].bind(this)(armature, movementType, movementID);
        },

        _animationEvent: {
            /*
             * start: 0,
             * complete: 1,
             * loopComplete: 2
             * */

            0: function (armature, movementType, movementID) {
                switch (movementID) {

                }
            },
            1: function (armature, movementType, movementID) {
                if (movementID === STATUS_TO_MOVEMENT_ID[STATUS_CONFIG.BEGAN]) {
                    this.idle();
                } else if (movementID === STATUS_TO_MOVEMENT_ID[STATUS_CONFIG.IDLE]) {
                    this.idle();
                } else if (movementID === STATUS_TO_MOVEMENT_ID[STATUS_CONFIG.DIED]) {
                    this.removeFromParent();
                } else if (movementID === STATUS_TO_MOVEMENT_ID[STATUS_CONFIG.MOVE]) {
                    this.idle();
                } else if (movementID === STATUS_TO_MOVEMENT_ID[STATUS_CONFIG.ATTACK]) {
                    this.idle();
                } else if (movementID === STATUS_TO_MOVEMENT_ID[STATUS_CONFIG.HURT]) {
                    if (this.status === STATUS_CONFIG.STIFF) {
                        this.soldierAnimation.play(STATUS_TO_MOVEMENT_ID[STATUS_CONFIG.IDLE]);
                    } else {
                        this.idle();
                    }
                } else {
                    this.idle();
                }
            },
            2: function (armature, movementType, movementID) {
                switch (movementID) {

                }
            }
        }
    });
})();


CREATE_FUNC(Soldier);