/**
 * Created by lcc3536 on 14-6-9.
 */


var GuideLine = (function () {
    var DEFAULT_GUIDE_LINE_RADIUS = 4;
    var DEFAULT_GUIDE_LINE_COLOR = cc.color(255, 255, 255, 255);

    return cc.Layer.extend({
        _points: null,
        _paintbrush: null,
        _radius: null,
        _color: null,

        ctor: function (args) {
            this._super();

            args = args || {};

            this._points = [];
            this._paintbrush = cc.DrawNode.create();
            this._radius = args.radius || DEFAULT_GUIDE_LINE_RADIUS;
            this._color = args.color || DEFAULT_GUIDE_LINE_COLOR;

            this.addChild(this._paintbrush);

            if (args.body_points) {
                this.drawGuideLine(args.body_points);
            }
        },

        drawGuideLine: function (body_points) {
            if (body_points) {
                if (body_points.length > 0 && body_points[0] instanceof op.Body) {
                    this._points = [];

                    var len = body_points.length;

                    for (var i = 0; i < len; ++i) {
                        this._points.push(body_points[i].origin);
                    }
                } else {
                    this._points = body_points;
                }

                this._drawGuideLine();
            }
        },

        clear: function () {
            this._paintbrush.clear();
        },

        setRadius: function (radius, drawNow) {
            if (radius) {
                this._radius = radius;

                if (drawNow) {
                    this._drawGuideLine();
                }
            }
        },

        setColor: function (color, drawNow) {
            if (color) {
                this._color = color;

                if (drawNow) {
                    this._drawGuideLine();
                }
            }
        },

        _drawGuideLine: function () {
            if (this._points && this._paintbrush) {
                this._paintbrush.clear();

                var len = this._points.length;

                for (var i = 0; i < len; ++i) {
                    this._paintbrush.drawDot(
                        this._points[i],
                            this._radius || DEFAULT_GUIDE_LINE_RADIUS,
                            this._color || DEFAULT_GUIDE_LINE_COLOR
                    );
                }
            }
        },

        _convert: function () {
            if (this._points && this._points.length > 0) {
                var len = this._points.length;

                for (var i = 0; i < len; ++i) {
                    this._points[i] = this.convertToNodeSpace(this._points[i]);
                }
            }
        }
    });
})();


CREATE_FUNC(GuideLine);