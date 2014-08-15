/**
 * Created by lcc3536 on 14-6-10.
 */


var Joystick = (function () {
    var DEFAULT_TOUCH_RANGE = 20;
    var MAX_DISTANCE = 250;

    var JOYSTICK_STATUS_CONFIG = {
        BEGAN: 0,
        MOVE: 1,
        END: 2
    };

    return cc.Layer.extend({
        delegate: null,
        originPoint: null,
        currentPoint: null,
        status: JOYSTICK_STATUS_CONFIG.BEGAN,

        ctor: function (delegate) {
            this._super();

            this.delegate = null;
            this.originPoint = null;
            this.currentPoint = null;
            this.status = JOYSTICK_STATUS_CONFIG.BEGAN;

            if (delegate) {
                this.setDelegate(delegate);
            }

            this._addListener();
        },

        setDelegate: function (delegate) {
            cc.assert(delegate != null && delegate.onLaunchBegan != null &&
                delegate.onLaunchMove != null && delegate.onLaunchEnd != null &&
                delegate.onLaunchCancelled != null, "set delegate error");

            this.delegate = delegate;
        },

        _addListener: function () {
//            if ("touches" in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this._onTouchBegan.bind(this),
                onTouchMoved: this._onTouchMoved.bind(this),
                onTouchEnded: this._onTouchEnded.bind(this),
                onTouchCancelled: this._onTouchCancelled.bind(this)
            }, this);
//            } else {
//                cc.log("TOUCH-ONE-BY-ONE is not supported on desktop");
//            }
        },

        _onTouchBegan: function (touch, event) {
            if (touch.getId() === 0) {
                this.originPoint = touch.getLocation();
                this.currentPoint = this.originPoint;
                this.status = JOYSTICK_STATUS_CONFIG.BEGAN;

                this.paintbrush = cc.DrawNode.create();
                this.addChild(this.paintbrush);

                this.paintbrush.drawCircle(this.originPoint, DEFAULT_TOUCH_RANGE, 0, 10);

                this.paintbrush1 = cc.DrawNode.create();
                this.addChild(this.paintbrush1);
            }

            return true;
        },

        _onTouchMoved: function (touch, event) {
            if (touch.getId() === 0) {
                this.currentPoint = touch.getLocation();

                if (this.paintbrush1 && this.originPoint) {
                    this.paintbrush1.clear();
                    this.paintbrush1.drawSegment(this.originPoint, this.currentPoint, 1);
                }

                this._onLaunchMove();
            }
        },

        _onTouchEnded: function (touch, event) {
            if (touch.getId() === 0) {
                this.currentPoint = touch.getLocation();

                this._onLaunchEnd();

                this._clearPaintbrush();
            }
        },

        _onTouchCancelled: function (touch, event) {
            if (touch.getId() === 0) {
                this._onLaunchCancelled();

                this._clearPaintbrush();
            }
        },

        _clearPaintbrush: function () {
            if (this.paintbrush) {
                this.paintbrush.removeFromParent();
                this.paintbrush = null;
            }

            if (this.paintbrush1) {
                this.paintbrush1.removeFromParent();
                this.paintbrush1 = null;
            }
        },

        _onLaunchBegan: function () {
            if (this.status == JOYSTICK_STATUS_CONFIG.BEGAN) {

                if (this.delegate.onLaunchBegan()) {
                    this.status = JOYSTICK_STATUS_CONFIG.MOVE;
                } else {
                    this.status = JOYSTICK_STATUS_CONFIG.END;

                    this._clearPaintbrush();
                }
            }
        },

        _onLaunchMove: function () {
            if (this.status != JOYSTICK_STATUS_CONFIG.END) {
                var distance = cc.pDistance(this.currentPoint, this.originPoint);

                distance = Math.min(distance, MAX_DISTANCE);

                if (this.status == JOYSTICK_STATUS_CONFIG.BEGAN &&
                    distance > DEFAULT_TOUCH_RANGE) {
                    this._onLaunchBegan();
                }

                if (this.status == JOYSTICK_STATUS_CONFIG.MOVE) {
                    var degrees = cc.radiansToDegrees(cc.pToAngle(cc.pSub(this.originPoint, this.currentPoint)));

                    this.delegate.onLaunchMove(distance, degrees);
                }
            }
        },

        _onLaunchEnd: function () {
            if (this.status === JOYSTICK_STATUS_CONFIG.MOVE) {
                this.status = JOYSTICK_STATUS_CONFIG.END;

                var distance = cc.pDistance(this.currentPoint, this.originPoint);
                var degrees = cc.radiansToDegrees(cc.pToAngle(cc.pSub(this.originPoint, this.currentPoint)));

                distance = Math.min(distance, MAX_DISTANCE);

                if (distance > DEFAULT_TOUCH_RANGE) {
                    this.delegate.onLaunchEnd(distance, degrees);
                } else {
                    this.delegate.onLaunchCancelled();
                }
            }

            this.originPoint = null;
            this.currentPoint = null;
        },

        _onLaunchCancelled: function () {
            if (this.status === JOYSTICK_STATUS_CONFIG.MOVE) {
                this.originPoint = null;
                this.currentPoint = null;
                this.status = JOYSTICK_STATUS_CONFIG.END;

                this.delegate.onLaunchCancelled();
            }
        }
    });
})();


CREATE_FUNC(Joystick);