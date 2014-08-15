/**
 * Created by lcc3536 on 14-6-10.
 */


var Battlefield = (function () {
    return cc.Layer.extend({
        bgLayer: null,
        world: null,
        force: null,
        acceleration: null,
        team1: null,
        team2: null,
        funcQueue: null,
        isBegan: false,
        isEnd: false,
        spLabel: null,

        onEnter: function () {
            this._super();

            this.scheduleUpdate();
        },

        onExit: function () {
            this._super();

            this.unscheduleUpdate();
        },

        ctor: function (args) {
            this._super();

            cc.assert(args && args.team1 && args.team2 && args.bgRes, "battlefield ctor error");

            this.force = {};
            this.acceleration = {};
            this.team1 = args.team1;
            this.team2 = args.team2;
            this.funcQueue = [];
            this.isBegan = false;
            this.isEnd = false;
            this.spLabel = null;

            if (args.force) {
                this.setForce(args.force);
            }

            if (args.acceleration) {
                this.setAcceleration(args.acceleration);
            }

            this.bgLayer = BgLayer.create(args.bgRes);
            this.addChild(this.bgLayer);
            this.world = cc.rect(-100, DEFAULT_FLOOR_HEIGHT, this.bgLayer.getMaxWidth() + 100 * 2, cc.winSize.height * 10);

            this.team1.addToBattlefield(this);
            this.team2.addToBattlefield(this);

            if (this.team1.hasHero()) {
                this.team2.setSoldierXRange({
                    min: this.team1.getSoldierCriticalPoint().x,
                    max: SOLDIER_POSITION_X_ENEMY
                });
            }

            if (this.team2.hasHero()) {
                this.team1.setSoldierXRange({
                    min: SOLDIER_POSITION_X_OWN,
                    max: this.team2.getSoldierCriticalPoint().x
                });
            }

            var local = cc.p(50, 600)

            var timestamp = _.now();
            var timeLabel = cc.LabelTTF.create("0 : 0", "Times New Roman", 20);
            timeLabel.setPosition(this.convertToNodeSpace(local));
            this.addChild(timeLabel, 10);

            this.schedule(function () {
                timeLabel.setPosition(this.convertToNodeSpace(local));

                if (!this.isEnd) {
                    var interval = Math.floor((_.now() - timestamp) / MILLISECONDS_TO_SECONDS);
                    timeLabel.setString(Math.floor(interval / 60) + " : " + (interval % 60));
                }
            });

            xx = this;
        },

        update: function (dt) {
            if (!this.isEnd) {
                if (this.isBegan) {
                    this._updateTeams(dt);
                    this._updateFuncQueue(dt);
                } else {
                    this.isBegan = this.team1.isBegan && this.team2.isBegan;
                }
            }
        },

        _updateTeams: function (dt) {
            this.team1.update(dt);
            this.team2.update(dt);

            this.x = HERO_POSITION_X_OWN - this.team1.hero.x;
            this.bgLayer.update(dt);
        },

        _updateFuncQueue: function (dt) {
            var len = this.funcQueue.length;
            for (var i = 0; i < len; ++i) {
                if (!this.funcQueue[i] || !this.funcQueue[i](dt)) {
                    this.funcQueue.splice(i, 1);

                    i -= 1;
                    len -= 1;
                }
            }
        },

        checkMissile: function (missile) {
            var teams = missile.getTargetTeams();

            var len = teams.length;
            for (var i = 0; i < len; ++i) {
                if (teams[i].checkMissile(missile)) {
                    return true;
                }
            }

            var point = missile.getPosition();

            if (point.y <= this.world.y) {
                missile.end();
                return true;
            }

            if (!cc.rectContainsPoint(this.world, point)) {
                missile.cancel();
                return true;
            }

            return false;
        },

        addUpdateFunc: function (func) {
            this.funcQueue.push(func);
        },

        getNextAtkUnit: function (heroOrSoldier) {
            return this.getRival(heroOrSoldier).getNextAtkUnit(heroOrSoldier);
        },

        getRival: function (teamOrHeroOrSoldierOrMissile) {
            var team = null;

            if (teamOrHeroOrSoldierOrMissile instanceof Team) {
                team = teamOrHeroOrSoldierOrMissile === this.team1 ? this.team2 : this.team1;
            } else if (teamOrHeroOrSoldierOrMissile instanceof Hero) {
                team = teamOrHeroOrSoldierOrMissile.team === this.team1 ? this.team2 : this.team1;
            } else if (teamOrHeroOrSoldierOrMissile instanceof Soldier) {
                team = teamOrHeroOrSoldierOrMissile.team === this.team1 ? this.team2 : this.team1;
            } else if (teamOrHeroOrSoldierOrMissile instanceof Missile) {
                team = teamOrHeroOrSoldierOrMissile.team === this.team1 ? this.team2 : this.team1;
            }

            cc.assert(team, "get rival error, rival no exist");

            return team;
        },

        over: function (winner) {
            if (!this.isEnd) {
                this.isEnd = true;

                this.unscheduleUpdate();

                var isWin = winner === TEAM_TYPE_CONFIG.ENEMY;

                this.team1.over(isWin);
                this.team2.over(!isWin);
                this._updateFuncQueue();

                this.getParent().next(isWin);
            }
        },

        setForce: function (force, type) {
            cc.assert(force != null && typeof(force) === "object", "set force force error");

            if (type !== undefined) {
                cc.assert(type in FORCE_TYPE, "set force type error");

                this.force[FORCE_TYPE[type]] = force;

                return;
            }

            for (var key in FORCE_TYPE) {
                type = FORCE_TYPE[key];

                if (force[type]) {
                    this.force[type] = force[type];
                }
            }
        },

        getForce: function (type) {
            if (type !== undefined) {
                cc.assert(type in FORCE_TYPE, "get force type error");

                return cc.clone(this.force[FORCE_TYPE[type]]);
            }

            var f = op.f(0, 0);

            for (var key in this.force) {
                f.x += this.force[key].x;
                f.y += this.force[key].y;
            }

            return f;
        },

        setAcceleration: function (acceleration, type) {
            cc.assert(acceleration != null || typeof (acceleration) === "object", "set acceleration acceleration error");

            if (type != undefined) {
                cc.assert(type in ACCELERATION_TYPE, "set acceleration type error");

                this.acceleration[ACCELERATION_TYPE[type]] = acceleration;

                return;
            }

            for (var key in ACCELERATION_TYPE) {
                type = ACCELERATION_TYPE[key];

                if (acceleration[type]) {
                    this.acceleration[type] = acceleration[type];
                }
            }
        },

        getAcceleration: function (type) {
            if (type !== undefined) {
                cc.assert(type in ACCELERATION_TYPE, "get acceleration type error");

                return cc.clone(this.acceleration[ACCELERATION_TYPE[type]]);
            }

            var a = op.a(0, 0);

            for (var key in this.acceleration) {
                a.x += this.acceleration[key].x;
                a.y += this.acceleration[key].y;
            }

            return a;
        },

        getMaxWidth: function () {
            return this.bgLayer.getMaxWidth();
        }
    })
})();


CREATE_FUNC(Battlefield);