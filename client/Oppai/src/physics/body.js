/**
 * Created by lcc3536 on 14-6-9.
 */


var op = op || {};

op.Body = (function () {

    /*
     * 抛物体数据结构体
     *
     * origin        当前位置
     * lv            线速度
     * radian        夹角（弧度）
     * degrees       夹角（角度）
     * v             速度xy分量
     * a             加速度xy分量
     * */

    return cc.ex.Entity.extend({
        ctor: function (args) {
            cc.assert(args != null && (args.lv != null || args.v != null), "body init args error");

            this.sets({
                origin: args.origin || cc.p(0, 0),
                lv: args.lv,
                radian: args.radian,
                degrees: args.degrees,
                v: args.v,
                a: args.a || op.a(0, 0)
            });


            if (this.lv == null) {
                this.lv = op.getLV(this.v);
                this.radian = cc.pToAngle(this.v);
                this.degrees = cc.radiansToDegrees(this.radian);
            }

            if (this.v == null) {
                if (this.radian == null) {
                    this.radian = cc.degreesToRadians(this.degrees);
                }

                if (this.degrees == null) {
                    this.degrees = cc.radiansToDegrees(this.radian);
                }

                this.v = op.v(
                    this.lv * Math.cos(this.radian),
                    this.lv * Math.sin(this.radian)
                );
            }
        }
    });
})();


CREATE_FUNC(op.Body);