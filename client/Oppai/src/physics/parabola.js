/**
 * Created by lcc3536 on 14-6-9.
 */


var op = op || {};

(function () {
    op.nextParabolaBody = function (body, dt, floor) {
        var v = body.v;
        var a = body.a;

        var x = body.origin.x + v.x * dt + a.x * dt * dt / 2;
        var y = body.origin.y + v.y * dt + a.y * dt * dt / 2;

        if (floor != null && y < floor) {
            var min = 0;
            var max = dt;
            var mid = null;

            while (y > floor || floor - y > op.EPSILON) {
                mid = (min + max) / 2;

                y = body.origin.y + v.y * mid + a.y * mid * mid / 2;

                if (y < floor) {
                    max = mid;
                } else {
                    min = mid;
                }
            }

            if (mid != null) {
                x = body.origin.x + v.x * mid + a.x * mid * mid / 2;
                dt = mid;
            }
        }

        return op.Body.create({
            origin: cc.p(x, y),
            v: op.v(
                v.x + a.x * dt,
                v.y + a.y * dt
            ),
            a: cc.clone(a)
        });
    };
})();