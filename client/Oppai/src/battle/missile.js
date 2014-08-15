/**
 * Created by lcc3536 on 14-6-10.
 */


var Missile = (function () {
    return cc.Node.extend({
        status: 0,
        battlefield: null,
        team: null,
        hero: null,
        force: 0,
        skill: null,
        resId: null,
        type: HERO_SKILL_TYPE_CONFIG.DEFAULT,
        target: HERO_SKILL_TARGET_CONFIG.DEFAULT,
        mass: 0,
        range: 0,
        spCost: 0,
        distance: 0,
        degrees: 0,
        muzzle: null,
        deviation: null,            // 误差
        locus: null,
        missileArmature: null,
        unit: null,

        ctor: function (args) {
            this._super();

            cc.assert(args && args.battlefield != null && args.team != null && args.hero != null &&
                args.force != null && args.force > 0 && args.skill, "missile init args error");

            this.status = MISSILE_STATUS_CONFIG.DEFAULT;

            this.battlefield = args.battlefield;
            this.team = args.team;
            this.hero = args.hero;
            this.force = args.force;
            this.skill = args.skill;

            this.resId = this.skill.resId;
            this.type = this.skill.type;
            this.target = this.skill.target;
            this.mass = this.skill.mass;
            this.range = this.skill.range;
            this.spCost = this.skill.spCost;

            this.distance = 0;
            this.degrees = 0;
            this.muzzle = cc.p(0, 0);
            this.deviation = op.a(0, 0);
            this.unit = null;
            this.locus = [];

            var url = "missile_" + this.resId;

            this.missileArmature = ccs.Armature.create(url);
            this.addChild(this.missileArmature);

            this.missileArmature.getAnimation().setMovementEventCallFunc(this.animationEvent, this);
            this.missileArmature.getAnimation().setFrameEventCallFunc(this.onFrameEvent, this);
        },

        update: function (dt) {
            if (this.status === MISSILE_STATUS_CONFIG.MOVE) {
                cc.assert(this.locus && this.locus.length > 0, "get next body error, locus not exist");

                var perBody = this.locus[this.locus.length - 1];

                perBody.a = this.getAcceleration();

                var body = op.nextParabolaBody(perBody, dt, this.battlefield.world.y);

                this.locus.push(body);

                this.setPosition(body.origin);

                this.missileArmature.getBone("rotation_node").getDisplayRenderNode().setRotationEx(body.degrees);
            }
        },

        began: function () {
            this.status = MISSILE_STATUS_CONFIG.BEGAN;
            this.battlefield.addChild(this, 5);
            this.visible = false;
        },

        move: function () {
            this.setPosition(this.muzzle);
            this.visible = true;

            this.status = MISSILE_STATUS_CONFIG.MOVE;

            var body = this.getBody();
            this.setPosition(body.origin);
            this.locus.push(body);

            this.missileArmature.getAnimation().play("move");
        },

        end: function () {
            this.status = MISSILE_STATUS_CONFIG.END;

            this.missileArmature.getAnimation().play("end");

            var drawNode = cc.DrawNode.create();
            this.addChild(drawNode);

            drawNode.drawCircle(cc.p(0, 0), this.range, 0, 20);

            heroSkill[this.skill.id].bind(this)();
        },

        cancel: function () {
            this.status = MISSILE_STATUS_CONFIG.CANCEL;

            this.removeFromParent();
        },

        over: function (isWin) {
            this.cancel();
        },

        getTargetTeams: function () {
            cc.assert(this.target != null && this.target != HERO_SKILL_TARGET_CONFIG.DEFAULT, "missile get target error,");
            var teams = [];

            if (this.target == HERO_SKILL_TARGET_CONFIG.ALL) {
                teams.push(this.team, this.battlefield.getRival(this));
            } else if (this.target == HERO_SKILL_TARGET_CONFIG.OWN) {
                teams.push(this.team);
            } else if (this.target == HERO_SKILL_TARGET_CONFIG.ENEMY) {
                teams.push(this.battlefield.getRival(this));
            }

            return teams;
        },

        getTargets: function () {
            var teams = this.getTargetTeams();

            var targets = [];
            var len = teams.length;

            for (var i = 0; i < len; ++i) {
                targets = targets.concat(teams[i].getMissileTargets(this));
            }

            return targets;
        },

        getBody: function () {
            var ax = this.force / this.mass;
            var lv = Math.sqrt(2 * this.distance / ax) * ax;

            return body = op.Body.create({
                origin: this.muzzle,
                lv: lv,
                degrees: this.degrees,
                a: this.getAcceleration()
            });
        },

        getAcceleration: function () {
            var a = this.battlefield.getAcceleration();
            var f = this.battlefield.getForce();

            a.x += f.x / this.mass;
            a.y += f.y / this.mass;

            if (this.status !== MISSILE_STATUS_CONFIG.MOVE) {
                return a
            }

            return cc.pAdd(a, this.deviation);
        },

        animationEvent: function (armature, movementType, movementID) {
            if (movementType === ccs.MovementEventType.complete) {
                if (movementID === "begin") {
                    this.status = MISSILE_STATUS_CONFIG.MOVE;

                    var body = this.getBody();
                    this.setPosition(body.origin);
                    this.locus.push(body);

                    this.missileArmature.getAnimation().play("move");
                } else if (movementID === "end") {
                    this.removeFromParent();
                }
            }
        }
    })
})();


CREATE_FUNC(Missile);