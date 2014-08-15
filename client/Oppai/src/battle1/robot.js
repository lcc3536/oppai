/**
 * Created by lcc3536 on 14-5-26.
 */


var Robot = ActionSprite.extend({
    _nextDecisionTime: 0,

    init: function () {
        if (!this.initWithSpriteFrameName("robot_idle_00.png")) return false;

        this._nextDecisionTime = 0;

        var i;

        var idleFrames = [];
        for (i = 0; i < 5; ++i) {
            idleFrames.push(cc.spriteFrameCache.getSpriteFrame("robot_idle_0" + i + ".png"));
        }
        this._idleAction = cc.RepeatForever.create(
            cc.Animate.create(
                cc.Animation.create(idleFrames, 1.0 / 12.0)
            )
        );

        var diedFrames = [];
        for (i = 0; i < 5; ++i) {
            diedFrames.push(cc.spriteFrameCache.getSpriteFrame("robot_knockout_0" + i + ".png"));
        }
        this._diedAction = cc.Sequence.create(
            cc.Animate.create(
                cc.Animation.create(diedFrames, 1.0 / 12.0)
            ),
            cc.Blink.create(2.0, 10.0)
        );

        var moveFrames = [];
        for (i = 0; i < 6; ++i) {
            moveFrames.push(cc.spriteFrameCache.getSpriteFrame("robot_walk_0" + i + ".png"));
        }
        this._moveAction = cc.RepeatForever.create(
            cc.Animate.create(
                cc.Animation.create(moveFrames, 1.0 / 12.0)
            )
        );

        var attackFrames = [];
        for (i = 0; i < 5; ++i) {
            attackFrames.push(cc.spriteFrameCache.getSpriteFrame("robot_attack_0" + i + ".png"));
        }
        this._attackAction = cc.Sequence.create(
            cc.Animate.create(
                cc.Animation.create(attackFrames, 1.0 / 24.0)
            ),
            cc.CallFunc.create(this.idle, this)
        );

        var hurtFrames = [];
        for (i = 0; i < 3; ++i) {
            hurtFrames.push(cc.spriteFrameCache.getSpriteFrame("robot_hurt_0" + i + ".png"));
        }
        this._hurtAction = cc.Sequence.create(
            cc.Animate.create(
                cc.Animation.create(hurtFrames, 1.0 / 12.0)
            ),
            cc.CallFunc.create(this.idle, this)
        );

        this._centerToBottom = 39;
        this._centerToSides = 29;
        this._hp = 100;
        this._damage = 10;
        this._speed = 80;

        this._hitBox = this.createBox(
            cc.p(-this._centerToSides, -this._centerToBottom),
            cc.size(this._centerToSides * 2, this._centerToBottom * 2)
        );

        this._attackBox = this.createBox(
            cc.p(this._centerToSides, -5),
            cc.size(25, 20)
        );

        return true;
    }
});


CREATE_FUNC(Robot);