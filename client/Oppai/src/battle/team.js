/**
 * Created by lcc3536 on 14-7-7.
 */


var Team = (function () {
    return cc.ex.Entity.extend({
        type: TEAM_TYPE_CONFIG.DEFAULT,
        battlefield: null,
        control: null,
        timestamp: 0,
        sp: 0,
        heroId: null,
        soldiersId: null,
        soldiersConfig: null,
        hero: null,
        soldiers: null,
        aiId: 0,
        ai: null,
        soldierXRange: null,
        isBegan: false,

        ctor: function (args) {
            cc.assert(args && args.type != null && (args.aiId != null || (args.heroId != null && args.soldiersId != null)), "team ctor args error");

            this.timestamp = 0;
            this.sp = INITIAL_SP;
            this.type = args.type;
            this.battlefield = args.battlefield;
            this.control = null;
            this.heroId = args.heroId;
            this.soldiersId = args.soldiersId;
            this.aiId = args.aiId;
            this.soldierXRange = DEFAULT_SOLDIER_X_RANGE[this.type];
            this.isBegan = false;

            this._loadAi();
            this._loadHero();
            this._loadSoldiersConfig();
        },

        addToBattlefield: function (battlefield) {
            cc.assert(battlefield, "add to battlefield error, battlefield no exist");

            this.battlefield = battlefield;

            if (this.hasHero()) {
                this.isBegan = false;
                this.hero.addToBattlefield(this.battlefield);
            } else {
                this.isBegan = true;
            }

            for (var i = 0; i < this.soldiers.length; ++i) {
                this.soldiers[i].addToBattlefield(this.battlefield);
            }
        },

        _loadAi: function () {
            this.ai = null;

            if (this.aiId != null) {
                this.ai = TeamAI.create({
                    team: this,
                    id: this.aiId
                });

                this.sp = MAX_SP;
            }
        },

        _loadHero: function () {
            if (this.heroId != null) {
                this.hero = Hero.create({
                    type: this.type,
                    battlefield: this.battlefield,
                    team: this,
                    id: this.heroId
                });
            }
        },

        _loadSoldiersConfig: function () {
            this.soldiers = [];

            if (!this.ai) {
                this.soldiersConfig = [];

                var soldierData;
                var now = _.now();
                var len = this.soldiersId.length;

                for (var i = 0; i < len; ++i) {
                    soldierData = SOLDIER_CONFIG[this.soldiersId[i]];

                    cc.assert(soldierData, "team load soldiers config, soldier data not exist");

                    this.soldiersConfig[i] = op.attr({}, soldierData);
//                    this.soldiersConfig[i].nextTime = now;
                }
            }
        },

        update: function (dt) {
            this._updateSp(dt);
            this._updateHero(dt);
            this._updateSoldiers(dt);
            this._updateSoldiersTargetZ(dt);
            this._updateAi(dt);
            this._updateControl(dt);
        },

        _updateSp: function (dt) {
            if (this.ai) return;

            var now = _.now();

            if (this.timestamp === 0) {
                this.timestamp = now;
            } else if (now > this.timestamp) {
                this.sp += (now - this.timestamp) / MILLISECONDS_TO_SECONDS * SP_GROWTH_RATE;
                this.sp = Math.min(this.sp, MAX_SP);

                this.timestamp = now;
            }
        },

        _updateHero: function (dt) {
            if (this.hasHero()) {
                this.hero.update(dt);

                if (this.type === TEAM_TYPE_CONFIG.OWN) {
                    var heroX = this.hero.x;
                    var maxX = this.battlefield.getMaxWidth() - cc.winSize.width + HERO_POSITION_X_OWN;
                    var isMove = false;

                    if (heroX < maxX) {
                        var len = this.soldiers.length;
                        for (var i = 0; i < len; ++i) {
                            var x = this.soldiers[i].x - HERO_TO_SOLDIER_MAX_DISTANCE;

                            if (x - heroX > DISTANCE_EPSILON) {
                                heroX = Math.min(x, maxX);

                                this.hero.x = heroX;
                                this.hero.move();

                                isMove = true;
                            }
                        }
                    }

                    if (!isMove && this.hero.status === STATUS_CONFIG.MOVE) {
                        this.hero.idle();
                    }
                }
            }
        },

        _updateSoldiers: function (dt) {
            var maxWidth = this.battlefield.getMaxWidth();
            var soldier = null;
            var len = this.soldiers.length;

            for (var i = 0; i < len; ++i) {
                soldier = this.soldiers[i];

                soldier.update(dt);

                if (soldier.status === STATUS_CONFIG.DIED) {
                    this.soldiers.splice(i, 1);

                    i -= 1;
                    len -= 1;
                }

                if (this.type === TEAM_TYPE_CONFIG.OWN) {
                    if (soldier.x + DEFAULT_PASS_LIMIT_X >= maxWidth) {
                        this.battlefield.over(this.getRivalType());
                    }
                }
            }

            this.soldiers.sort(this._sortSoldiers.bind(this));
        },

        //更新小兵的目标Z坐标
        _updateSoldiersTargetZ: function () {
            var len = this.soldiers.length;
            if (len < 1) {
                return
            } else if (len === 1) {
                this.soldiers.targetZ = 0;
                return
            }

            var array = [];
            array[0] = this.soldiers[0];
            var intervalBegin = this.soldiers[0].position.x;
            var sumInInterval = 1;
            for (var i = 1; i < len; ++i) {
                var judgeExtrusionWidth = 100;   //判定需要分轴的区间宽度（放全局）
                if (Math.abs(this.soldiers[i].position.x - intervalBegin) <= judgeExtrusionWidth) {
                    array.push(this.soldiers[i]);
                    sumInInterval++
                }
                if (Math.abs(this.soldiers[i].position.x - intervalBegin) > judgeExtrusionWidth || i === len - 1) {
                    if (sumInInterval > 1) {
                        var widthBattleField = 200;  //战场的最大高度（放全局）

                        array.sort(function (a, b) {
                            if (a.position.z === b.position.z) {
                                if (this.type === TEAM_TYPE_CONFIG.OWN) {
                                    return b.position.x - a.position.x
                                } else {
                                    return a.position.x - b.position.x
                                }
                            }
                            return a.position.z - b.position.z
                        });

                        for (var j = 0; j < sumInInterval; j++) {
                            array[j].targetZ = -0.5 * widthBattleField + widthBattleField * (j + 1) / (sumInInterval + 1)
                        }
                    }
                    array = [];
                    array[0] = this.soldiers[i];
                    intervalBegin = this.soldiers[i].position.x;
                    sumInInterval = 1
                }
            }
        },

        _updateAi: function (dt) {
            if (this.ai) {
                this.ai.update(dt);

                if (this.ai.isEnd && !this.hero && this.soldiers.length === 0) {
                    this.battlefield.over(this.type);
                }
            }
        },

        _updateControl: function (dt) {
            if (this.control) {
                this.control.update(dt);
            }
        },

        _sortSoldiers: function (a, b) {
//            if (a.status === STATUS_CONFIG.STIFF) {
//                return 1;
//            }
//
//            if (b.status === STATUS_CONFIG.STIFF) {
//                return -1;
//            }

            if (this.type === TEAM_TYPE_CONFIG.OWN) {
                return b.getHitPoint().x - a.getHitPoint().x;
            } else {
                return a.getHitPoint().x - b.getHitPoint().x;
            }
        },

        hasHero: function () {
            return  (this.hero != null);
        },

        checkMissile: function (missile) {
            if (this.hasHero()) {
                if (this.hero.checkMissile(missile)) {
                    return true;
                }
            }

            var len = this.soldiers.length;
            for (var i = 0; i < len; ++i) {
                if (this.soldiers[i].checkMissile(missile)) {
                    return true;
                }
            }

            return false;
        },

        getMissileTargets: function (missile) {
            var targets = [];
            var target = null;

            var len = this.soldiers.length;
            for (var i = 0; i < len; ++i) {
                target = this.soldiers[i].judgeMissile(missile);
                if (target) {
                    targets.push(target);
                }
            }

            if (this.hasHero()) {
                target = this.hero.judgeMissile(missile);
                if (target) {
                    targets.push(target);
                }
            }

            return targets;
        },

        setSoldierXRange: function (soldierXRange) {
            cc.assert(soldierXRange != null, "set soldier range error, range is null");

            this.soldierXRange = soldierXRange;
        },

        getSoldierXRange: function () {
            return this.soldierXRange;
        },

        getSp: function () {
            return Math.floor(this.sp);
        },

        addSp: function (sp) {
            if (!this.ai) {
                this.sp += sp;

                this.sp = Math.min(this.sp, MAX_SP);
                this.sp = Math.max(this.sp, 0);
            }
        },

        subSp: function (sp) {
            this.addSp(-sp);
        },

        getNextAtkUnit: function (enemyHeroOrSoldier) {
            var enemySoldierIsAirUnit = enemyHeroOrSoldier instanceof Hero ? false : enemyHeroOrSoldier.isAirUnit();

            var soldier = null;
            var len = this.soldiers.length;

            for (var i = 0; i < len; ++i) {
                soldier = this.soldiers[i];

                if (soldier.isBegan && (enemySoldierIsAirUnit || soldier.isGroundUnit())) {
                    return soldier;
                }
            }

            return this.hero;
        },

        over: function (isWin) {
            if (this.hasHero()) {
                this.hero.over(isWin);
            }

            len = this.soldiers.length;
            for (i = 0; i < len; ++i) {
                this.soldiers[i].over(isWin);
            }
        },

        getRivalType: function () {
            return (this.type === TEAM_TYPE_CONFIG.OWN ? TEAM_TYPE_CONFIG.ENEMY : TEAM_TYPE_CONFIG.OWN);
        },

        selectSkill: function (id) {
            if (this.hasHero()) {
                return this.hero.selectSkill(id);
            }

            return false;
        },

        canUseSkill: function (id) {
            if (this.hasHero()) {
                return this.hero.canUseSkill(id);
            }

            return false;
        },

        useSkill: function (id, distance, degrees) {
            if (this.selectSkill(id) && this.canUseSkill(id)) {
                if (this.onLaunchBegan()) {
                    this.onLaunchMove(distance, degrees);
                    this.onLaunchEnd(distance, degrees);

                    return true;
                }
            }

            return false;
        },

        onLaunchBegan: function () {
            if (this.hasHero()) {
                return this.hero.onLaunchBegan();
            }

            return false;
        },

        onLaunchMove: function (distance, degrees) {
            if (this.hasHero()) {
                this.hero.onLaunchMove(distance, degrees);
            }
        },

        onLaunchEnd: function (distance, degrees) {
            if (this.hasHero()) {
                this.hero.onLaunchEnd(distance, degrees);
            }
        },

        onLaunchCancelled: function () {
            if (this.hasHero()) {
                this.hero.onLaunchCancelled();
            }
        },

        addSoldier: function (id) {
            cc.assert(id, "team add soldier error, id no exist");

            var soldier = Soldier.create({
                type: this.type,
                team: this,
                id: id
            });

            soldier.addToBattlefield(this.battlefield);

            this.soldiers.push(soldier);

            return true;
        },

        convertSoldierId: function (id) {
            cc.assert(id != null && this.soldiersId[id] != null, "convert soldier id error");

            return this.soldiersId[id];
        },

        getSoldiersLen: function () {
            return this.soldiersConfig.length;
        },

        isSoldierExist: function (id) {
            id = this.convertSoldierId(id);

            var len = this.soldiers.length;
            for (var i = 0; i < len; ++i) {
                if (this.soldiers[i].id === id) {
                    return true;
                }
            }

            return false;
        },

        getSoldierCd: function (id) {
            return Math.max(this.soldiersConfig[id].nextTime - _.now(), 0);
        },

        getSoldierCdPercent: function (id) {
            return this.getSoldierCd(id) / this.soldiersConfig[id].cd * 100;
        },

        getSoldierSp: function (id) {
            return this.soldiersConfig[id].spCost;
        },

        sendTroops: function (id) {
            if (!this.ai) {
//                if (this.getSoldierCd(id) > 0) {
//                    this.tip("正在冷却中");
//                    return false;
//                }

                if (this.getSp() < this.getSoldierSp(id)) {
                    this.tip("SP值不足");
                    return false;
                }

                if (this.isSoldierExist(id)) {
                    this.tip("该兵已存在");
                    return false;
                }

                var soldierConfig = this.soldiersConfig[id];

                this.subSp(soldierConfig.spCost);
//                soldierConfig.nextTime = _.now() + soldierConfig.cd;

                soldierConfig.spCost *= 2;
            }

            return this.addSoldier(this.convertSoldierId(id));
        },

        getSoldierPoint: function () {
            return this.battlefield.convertToNodeSpace(DEFAULT_SOLDIER_POSITION[this.type]);
        },

        getSoldierCriticalPoint: function () {
            if (this.hasHero()) {
                return this.hero.getHitPoint();
            }

            return this.battlefield.convertToNodeSpace(DEFAULT_SOLDIER_CRITICAL_POINT[this.type]);
        },

        setControl: function (control) {
            cc.assert(control, "team set control error, control no exist");

            this.control = control;
        },

        tip: function (str, size, color) {
            if (this.control) {
                this.control.tip.apply(this.control, arguments);
            }
        }
    });
})();


CREATE_FUNC(Team);