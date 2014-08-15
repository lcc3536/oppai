/**
 * Created by lcc3536 on 14-5-22.
 */


var ActionSprite = cc.Sprite.extend({
    _status: HERO_STATUS_CONFIG.DEFAULT,
    _idleAction: null,
    _diedAction: null,
    _moveAction: null,
    _attackAction: null,
    _hurtAction: null,
    _hp: 0,
    _damage: 0,
    _speed: 0,
    _velocity: 0,
    _desiredPosition: 0,
    _centerToSides: 0,
    _centerToBottom: 0,
    _hitBox: null,
    _attackBox: null,

    ctor: function () {
        this._super();

        this._status = HERO_STATUS_CONFIG.DEFAULT;

        this._idleAction = null;
        this._diedAction = null;
        this._moveAction = null;
        this._attackAction = null;
        this._hurtAction = null;
        this._hitBox = null;
        this._attackAction = null;

        this._hp = 0;
        this._damage = 0;
        this._speed = 0;

        this._velocity = null;
        this._desiredPosition = null;

        this._centerToSides = 0;
        this._centerToBottom = 0;
    },

    update: function (dt) {
        if (this._status == HERO_STATUS_CONFIG.MOVE) {
            this._desiredPosition = cc.pAdd(this.getPosition(), cc.pMult(this._velocity, dt));
        }
    },

    createBox: function (origin, size) {
        var position = this.getPosition();

        return {
            original: cc.rect(origin.x, origin.y, size.width, size.height),
            actual: cc.rect(origin.x + position.x, origin.y + position.y, size.width, size.height)
        };
    },

    transformBoxes: function () {
        var position = this.getPosition();

        this._hitBox.actual.x = position.x + this._hitBox.original.x;
        this._hitBox.actual.y = position.y + this._hitBox.original.y;

        this._attackBox.actual.x = position.x + this._attackBox.original.x - (this.scaleX == -1 ? (this._attackBox.original.width + this._hitBox.original.width) : 0);
        this._attackBox.actual.y = position.y + this._attackBox.original.y;
    },

    setPosition: function () {
        this._super.apply(this, arguments);
        this.transformBoxes();
    },

    idle: function () {
        if (this._status !== HERO_STATUS_CONFIG.IDLE) {
            this.stopAllActions();
            this.runAction(this._idleAction);
            this._status = HERO_STATUS_CONFIG.IDLE;
            this._velocity = cc.p(0, 0);
        }
    },

    died: function () {
        this.stopAllActions();
        this.runAction(this._diedAction);
        this._hp = 0;
        this._status = HERO_STATUS_CONFIG.DIED;
    },

    move: function (direction) {
        if (this._status === HERO_STATUS_CONFIG.IDLE) {
            this.stopAllActions();
            this.runAction(this._moveAction);
            this._status = HERO_STATUS_CONFIG.MOVE;
        }

        if (this._status === HERO_STATUS_CONFIG.MOVE) {
            this._velocity = cc.p(direction.x * this._speed, direction.y * this._speed);

            if (this._velocity.x >= 0) {
                this.scaleX = 1.0;
            } else {
                this.scaleX = -1.0;
            }
        }
    },

    attack: function () {
        if (this._status !== HERO_STATUS_CONFIG.ATTACK) {
            if (this._status === HERO_STATUS_CONFIG.IDLE || this._status === HERO_STATUS_CONFIG.MOVE) {
                this.stopAllActions();
                this.runAction(this._attackAction);
                this._status = HERO_STATUS_CONFIG.ATTACK;
            }
        }
    },

    hurt: function (damage) {
        if (this._status !== HERO_STATUS_CONFIG.DIED) {
            this.stopAllActions();
            this.runAction(this._hurtAction);
            this._status = HERO_STATUS_CONFIG.HURT;
            this._hp -= damage;

            if (this._hp <= 0) {
                this.died();
            }
        }
    }
});