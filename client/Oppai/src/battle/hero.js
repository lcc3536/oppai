/**
 * Created by lcc3536 on 14-6-11.
 */


var Hero = (function () {
    var DEFAULT_DAMAGE_THRESHOLD = 0.05;    // 播放被击临界值

    return cc.Node.extend({
        status: STATUS_CONFIG.DEFAULT,
        type: TEAM_TYPE_CONFIG.DEFAULT,
        battlefield: null,
        team: null,
        id: 0,
        resId: 0,
        maxHp: 0,
        hp: 0,
        damage: 0,
        force: 0,
        crit: 0,
        dodge: 0,
        range: 0,
        trajectory: 0,
        interval: 0,
        skill: null,
        skillId: null,
        selectSkillId: 0,
        heroArmature: null,
        heroAnimation: null,
        degrees: 0,
        missile: null,
        missiles: null,
        nextAtkTime: 0,
        atkCount: 0,
        blood: null,
        bloodHidTime: null,
        greedBlood: null,
        yellowBlood: null,
        guideLine: null,
        missileTargets: null,

        ctor: function (args) {
            this._super();

            cc.assert(args && args.type != null && args.team != null && args.id != null, "hero ctor args error");

            var now = _.now();

            this.type = args.type;
            this.team = args.team;
            this.id = args.id;
            this.atkCount = 0;
            this.missileTargets = null;

            this.load();
            this.loadSkill();

            this.markSprite = new cc.Sprite(res.target_png);
            this.markSprite.visible = false;
            this.addChild(this.markSprite);

            this.heroArmature = ccs.Armature.create("hero_" + this.resId);
            this.heroAnimation = this.heroArmature.getAnimation();
            this.heroAnimation.setMovementEventCallFunc(this.animationEvent, this);
            this.heroAnimation.setFrameEventCallFunc(this.onFrameEvent, this);
            this.addChild(this.heroArmature);

            this.loadSkillMaxComponent();

            if (this.type === TEAM_TYPE_CONFIG.ENEMY) {
                this.scaleX = -1;
            }

            this.blood = ccs.uiReader.widgetFromJsonFile(res.blood_ui);
            this.blood.setPosition(cc.pAdd(this.getBloodPoint(), cc.p(0, 50)));
            this.blood.scaleX = this.scaleX;
            this.blood.visible = false;
            this.addChild(this.blood);

            this.bloodHidTime = now;
            this.greedBlood = ccui.helper.seekWidgetByName(this.blood, "blood_green");
            this.yellowBlood = ccui.helper.seekWidgetByName(this.blood, "blood_yellow");

            var percent = this.getHpPercent();
            this.greedBlood.setPercent(percent);
            this.yellowBlood.setPercent(percent);

            if (cc.game.config[cc.game.CONFIG_KEY.debugMode] == cc.game.DEBUG_MODE_INFO) {
                this.drawNode = cc.DrawNode.create();
                this.addChild(this.drawNode, 10);
            }
        },

        addToBattlefield: function (battlefield) {
            var flag = false;

            if (this.battlefield) {
                this.retain();
                this.removeFromParent();

                flag = true;
            }

            this.battlefield = battlefield;

            var now = _.now();
            var len = this.skill.length;

            for (var i = 0; i < len; ++i) {
                this.skill[i].nextTime = now;
            }

            this.degrees = 0;
            this.missile = null;
            this.missiles = [];
            this.nextAtkTime = now;

            var position = DEFAULT_HERO_POSITION[this.type];
            this.setPosition(position);
            this.battlefield.addChild(this);

            if (flag) {
                this.release();
            }

            this.guideLine = GuideLine.create();
            this.battlefield.addChild(this.guideLine);

            this.began();
        },

        load: function () {
            var heroData = HERO_CONFIG[this.id];

            cc.assert(heroData, "hero load error, hero data not exist");

            op.attr(this, heroData);

            this.hp = this.maxHp;
        },

        loadSkill: function () {
            this.skill = [];
            this.selectSkillId = 0;

            cc.assert(this.skillId && this.skillId.length > 0, "hero skill id error");

            var now = _.now();
            var len = this.skillId.length;
            var skillData = null;
            var skillId = null;

            for (var i = 0; i < len; ++i) {
                skillId = this.skillId[i];
                skillData = HERO_SKILL_CONFIG[skillId];

                cc.assert(skillData, "hero load skill error, skill data no exist, skill id is " + skillId);

                this.skill[i] = op.attr({}, skillData);
                this.skill[i].id = skillId;
                this.skill[i].nextTime = now;
            }
        },

        loadSkillMaxComponent: function () {
            var animationData = this.heroAnimation.getAnimationData();

            cc.assert(animationData, "hero loadSkillMaxComponent animationData is null");

            for (var key in this.skill) {
                var skill = this.skill[key];

                cc.assert(skill, "load skill max component error, skill is null");

                var minRotation = skill.minRotation;
                var maxRotation = skill.maxRotation;

                var rotation = maxRotation - minRotation;

                cc.assert(rotation && rotation > 0, "hero skill rotation error");

                var maxComponent = rotation;

                while (maxComponent > 0) {
                    if (animationData.getMovement("ready_" + maxComponent) &&
                        animationData.getMovement("launch_" + maxComponent)) {
                        if (maxComponent == 1) {
                            skill.cell = rotation;
                        } else {
                            skill.cell = rotation / (maxComponent - 1);
                        }

                        skill.maxComponent = maxComponent;

                        break;
                    }

                    maxComponent -= 1;
                }
            }
        },

        update: function (dt) {
            this._draw();
            this._updateMissiles(dt);
            this._updateAttack(dt);
            this._updateBlood(dt);
        },

        _updateMissiles: function (dt) {
            var len, i;

            if (this.missileTargets && this.missileTargets.length > 0) {
                len = this.missileTargets.length;

                for (i = 0; i < len; ++i) {
                    if (this.missileTargets[i] != STATUS_CONFIG.DIED) {
                        this.missileTargets[i].setHitMark(false);
                    }
                }
            }

            if (this.status === STATUS_CONFIG.READY && this.missile &&
                this.missile.status === MISSILE_STATUS_CONFIG.BEGAN) {
                this.guideLine.drawGuideLine(this.missile.getLocusPoints());

                this.missileTargets = this.missile.getTargets();

                len = this.missileTargets.length;

                for (i = 0; i < len; ++i) {
                    this.missileTargets[i].setHitMark(true);
                }
            }

            var battlefield = this.battlefield;
            var missile = null;

            len = this.missiles.length;

            for (i = 0; i < len; ++i) {
                missile = this.missiles[i];

                if (battlefield.isEnd) {
                    missile.cancel();
                } else {
                    missile.update(dt);

                    if (missile.status === MISSILE_STATUS_CONFIG.MOVE) {
                        if (battlefield.checkMissile(missile)) {
                            missile.end();

                            this.missiles.splice(i, 1);

                            i -= 1;
                            len -= 1;
                        }
                    }
                }
            }
        },

        _updateAttack: function (dt) {
            this.attack(dt);
        },

        _updateBlood: function (dt) {
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
                var dict = this.heroArmature.getBoneDic();
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
            var point = this.heroArmature.convertToNodeSpace(
                missile.convertToWorldSpace(cc.p(0, 0))
            );

            if (op.pInArmature(this.heroArmature, point)) {
                missile.unit = this;

                return true;
            }

            return false;
        },

        judgeMissile: function (missile) {
            if (missile.unit && missile.unit === this) {
                return this;
            }

            var point = this.heroArmature.convertToNodeSpace(
                missile.convertToWorldSpace(cc.p(0, 0))
            );

            if (op.pToArmatureShorterRange(this.heroArmature, point, missile.range)) {
                return this;
            }

            return null;
        },

        updateStatus: function (status, replay) {
            this.status = status;

            var nowMovementID = STATUS_TO_MOVEMENT_ID[this.status];
            if (this.status === STATUS_CONFIG.READY || this.status === STATUS_CONFIG.LAUNCH) {
                nowMovementID += this._getComponent();
            }

            if (nowMovementID) {
                if (replay) {
                    this.heroAnimation.play(nowMovementID);
                } else {
                    var currentMovementID = this.heroAnimation.getCurrentMovementID();

                    if (!currentMovementID || currentMovementID !== nowMovementID) {
                        this.heroAnimation.play(nowMovementID);
                    }
                }
            } else {
                this.heroAnimation.stop();
            }
        },

        began: function () {
            this.updateStatus(STATUS_CONFIG.BEGAN, true);
        },

        idle: function () {
            this.updateStatus(STATUS_CONFIG.IDLE);
        },

        move: function () {
            if (this.status === STATUS_CONFIG.READY) {
                this.onLaunchCancelled();
            }

            this.updateStatus(STATUS_CONFIG.MOVE);
        },

        attack: function (dt) {
            var now = _.now();

            if (this.status === STATUS_CONFIG.IDLE) {
                if (now > this.nextAtkTime) {
                    var unit = this.battlefield.getNextAtkUnit(this);
                    if (unit) {
                        var p1 = this.getBullet();
                        var p2 = unit.getHitPoint();

                        if (Math.abs(p1.x - p2.x) < this.range) {
                            this.updateStatus(STATUS_CONFIG.ATTACK, true);

                            this.nextAtkTime = now + this.interval;
                            this.atkCount += 1;
                        }
                    }
                }
            }
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

            this.updateStatus(STATUS_CONFIG.DIED);

            this.battlefield.over(this.type);
        },

        ready: function () {
            this.updateStatus(STATUS_CONFIG.READY);
        },

        launch: function () {
            var skill = this.skill[this.selectSkillId];

            if (skill) {
                this.team.subSp(skill.spCost);
                skill.nextTime = _.now() + skill.cd;
            }

            this.updateStatus(STATUS_CONFIG.LAUNCH);
        },

        over: function (isWin) {
            var i, len;

            len = this.missiles.length;
            for (i = 0; i < len; ++i) {
                this.missiles[i].over(isWin);
            }

            this.blood.visible = false;

            if (isWin) {
                this.status = STATUS_CONFIG.STIFF;
                this.heroAnimation.play("win");
            }
        },

        _hurtForHero: function (damage) {
            if (this.status === STATUS_CONFIG.READY) {
                this.onLaunchCancelled();
            }

            this.updateStatus(STATUS_CONFIG.HURT, true);

            this._hurt(damage);
        },

        _hurtForSoldier: function (damage) {
            if (damage / this.maxHp > DEFAULT_DAMAGE_THRESHOLD) {
                this._hurtForHero(damage);
            } else {
                this.heroArmature.stopAllActions();

                this.heroArmature.runAction(
                    cc.sequence(
                        cc.tintTo(0.08, 255, 0, 0),
                        cc.tintTo(0.16, 255, 255, 255)
                    )
                );

                this._hurt(damage);
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
                scaleX: this.scaleX * 1.3,
                scaleY: this.scaleY * 1.3
            });
            bloodLabel.setPosition(this.getBloodPoint());
            this.addChild(bloodLabel);

            var label = ccui.helper.seekWidgetByName(bloodLabel, "label");

            label.setString(str);
            label.setColor(color);
            label.setFontSize(label.getFontSize() * scale);

            bloodLabel.runAction(
                cc.sequence(
                    cc.moveBy(1, cc.p(0, 70)),
                    cc.callFunc(function () {
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

        getSkillLen: function () {
            return this.skill.length;
        },

        selectSkill: function (id) {
            if (this.status === STATUS_CONFIG.READY) {
                this.team.tip("闹哪样啊，正在射你居然想切换。。");

                return false;
            }

            this.selectSkillId = id;

            return true;
        },

        getSelectSkill: function () {
            return this.selectSkillId;
        },

        getSkillCd: function (id) {
            id = id != null ? id : this.selectSkillId;

            return Math.max(this.skill[id].nextTime - _.now(), 0);
        },

        getSkillCdPercent: function (id) {
            return this.getSkillCd(id) / this.skill[id].cd * 100;
        },

        getSkillSp: function (id) {
            id = id != null ? id : this.selectSkillId;

            return this.skill[id].spCost;
        },

        canUseSkill: function (id) {
            id = id != null ? id : this.selectSkillId;

            return (this.team.getSp() >= this.skill[id].spCost);
        },

        onLaunchBegan: function () {
            if (this.status === STATUS_CONFIG.IDLE ||
                this.status === STATUS_CONFIG.ATTACK) {
                var skill = this.skill[this.selectSkillId];

                if (!skill) {
                    this.team.tip("请先选择技能");
                    return false;
                }

                if (!this.team.ai) {
                    if (this.getSkillCd() > 0) {
                        this.team.tip("正在冷却中");
                        return false;
                    }

                    if (this.team.getSp() < this.getSkillSp()) {
                        this.team.tip("SP值不足, 需要: " + skill.spCost);
                        return false;
                    }
                }

                this.status = STATUS_CONFIG.READY;

                this.missile = Missile.create({
                    battlefield: this.battlefield,
                    team: this.team,
                    hero: this,
                    force: this.force,
                    skill: skill,
                    type: skill.type,
                    target: skill.target,
                    mass: skill.mass,
                    resId: skill.resId,
                    damage: skill.damage,
                    range: skill.range,
                    spCost: skill.spCost
                });

                this.missile.began();

                return true;
            }

            return false;
        },

        onLaunchMove: function (distance, degrees) {
            if (this.status === STATUS_CONFIG.READY) {
                this.ready();

                if (this.missile) {
                    var skill = this.skill[this.selectSkillId];

                    if (skill) {
                        degrees = Math.max(degrees, skill.minRotation);
                        degrees = Math.min(degrees, skill.maxRotation);
                    }

                    this.degrees = degrees;

                    this.missile.distance = distance;
                    this.missile.degrees = this.type == TEAM_TYPE_CONFIG.OWN ? degrees : 180 - degrees;
                    this.missile.muzzle = this.getMuzzle();
                }
            }
        },

        onLaunchEnd: function (distance, degrees) {
            if (this.status === STATUS_CONFIG.READY) {
                this.launch();

                if (this.missile) {
                    var skill = this.skill[this.selectSkillId];

                    if (skill) {
                        degrees = Math.max(degrees, skill.minRotation);
                        degrees = Math.min(degrees, skill.maxRotation);
                    }

                    this.degrees = degrees;

                    this.missile.distance = distance;
                    this.missile.degrees = this.type == TEAM_TYPE_CONFIG.OWN ? degrees : 180 - degrees;
                }

                this.guideLine.clear();
            }
        },

        onLaunchCancelled: function () {
            if (this.status === STATUS_CONFIG.READY) {
                this.idle();
            }

            this.guideLine.clear();
            this.missile.cancel();
            this.missile = null;
        },

        getPoint: function () {
            return this.battlefield.convertToNodeSpace(this.heroArmature.convertToWorldSpace(cc.p(0, 0)));
        },

        getMuzzle: function () {
            var point = this.convertToNodeSpace(this.heroArmature.getBone("muzzle").convertToWorldSpace(cc.p(0, 0)));

            if (cc.sys.isNative) {
                point.x *= this.scaleX;
                point.y *= this.scaleY;
            }

            return this.battlefield.convertToNodeSpace(this.convertToWorldSpace(point));
        },

        getBullet: function () {
            var point = this.convertToNodeSpace(this.heroArmature.getBone("bullet").convertToWorldSpace(cc.p(0, 0)));

            if (cc.sys.isNative) {
                point.x *= this.scaleX;
                point.y *= this.scaleY;
            }

            return this.battlefield.convertToNodeSpace(this.convertToWorldSpace(point));
        },

        getHitNode: function () {
            return this.heroArmature.getBone("hit");
        },

        getHitPoint: function () {
            var point = this.convertToNodeSpace(this.getHitNode().convertToWorldSpace(cc.p(0, 0)));

            if (cc.sys.isNative) {
                point.x *= this.scaleX;
                point.y *= this.scaleY;
            }

            return this.battlefield.convertToNodeSpace(this.convertToWorldSpace(point));
        },

        getBloodPoint: function () {
            var point = this.convertToNodeSpace(this.heroArmature.getBone("blood_node").convertToWorldSpace(cc.p(0, 0)));

            if (cc.sys.isNative) {
                point.x *= this.scaleX;
                point.y *= this.scaleY;
            }

            return point;
        },

        _getComponent: function () {
            var skill = this.skill[this.selectSkillId];

            if (skill) {
                var minRotation = skill.minRotation;
                var maxRotation = skill.maxRotation;
                var maxComponent = skill.maxComponent;
                var cell = skill.cell;

                if (maxComponent == 1) {
                    return 1;
                }

                if (this.degrees <= minRotation + cell / 2) {
                    return 1;
                }

                if (this.degrees >= maxRotation - cell / 2) {
                    return maxComponent;
                }

                return Math.ceil(this.degrees / cell - 0.5) + 1;
            }

            return 1;
        },

        onFrameEvent: function (bone, evt, originFrameIndex, currentFrameIndex) {
            this._super(bone, evt, originFrameIndex, currentFrameIndex);

            switch (evt) {
                case "launch" :
                    if (this.missile) {
                        this.missile.muzzle = this.getMuzzle();
                        this.missile.move();
                        this.missiles.push(this.missile);
                        this.missile = null;
                    }
                    break;
                case "attack" :
                    cc.assert(this.atkId != null && heroAtk[this.atkId] != null,
                            "soldier atk error, atk id is " + this.atkId);
                    heroAtk[this.atkId].bind(this)();
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
                if (movementID.match(STATUS_TO_MOVEMENT_ID[STATUS_CONFIG.READY] + "\\d")) {
                    this.idle();
                } else if (movementID.match(STATUS_TO_MOVEMENT_ID[STATUS_CONFIG.LAUNCH] + "\\d")) {
                    this.idle();
                } else if (movementID === STATUS_TO_MOVEMENT_ID[STATUS_CONFIG.BEGAN]) {
                    this.team.isBegan = true;
                    this.idle();
                } else if (movementID === STATUS_TO_MOVEMENT_ID[STATUS_CONFIG.IDLE]) {
                    this.idle();
                } else if (movementID === STATUS_TO_MOVEMENT_ID[STATUS_CONFIG.ATTACK]) {
                    this.idle();
                } else if (movementID === STATUS_TO_MOVEMENT_ID[STATUS_CONFIG.HURT]) {
                    this.idle();
                } else if (movementID === STATUS_TO_MOVEMENT_ID[STATUS_CONFIG.DIED]) {

                } else if (movementID === "win") {
                    this.idle();
                }
            },
            2: function (armature, movementType, movementID) {
                switch (movementID) {

                }
            }
        }
    })
})();


CREATE_FUNC(Hero);