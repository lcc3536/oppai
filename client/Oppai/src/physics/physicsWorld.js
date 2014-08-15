/**
 * Created by lcc3536 on 14-6-17.
 */


var PhysicsWorld = (function () {
    return op.Entity.extend({
        space: null,
        body: null,

        ctor: function () {
            this._super();

            this.space = new cp.Space();
            this.space.gravity = cp.v(0, 0);
            this.body = {};

            // Physics debug layer
            var debugLayer = cc.PhysicsDebugNode.create(this.space);
            this.addChild(debugLayer, 9999);

            this.space.addCollisionHandler(
                1,
                2,
                this.begen.bind(this),
                this.preSolve.bind(this),
                this.postSolve.bind(this),
                this.separate.bind(this)
            );
        },

        addBody: function (body) {
            if (body instanceof cp.Body) {

                var body = new cp.Body(1, cp.momentForPoly(1, verts, cp.vzero));

            } else if (body instanceof ccs.Armature) {
                body = new cp.Body(Infinity, Infinity);
                var shapes = arbiter.getShapes();
                var filter = new ccs.ColliderFilter(this.enemyTag);
                this.armature2.setColliderFilter(filter);
                new cp.PolyShape(body, verts, cp.vzero);
            }

            new cp.Body();
        },

        // 开始碰撞
        begen: function () {

        },

        // 持续碰撞(相交)，可以设置相交时独自的摩擦，弹力等
        preSolve: function () {

        },

        // 调用完preSolve后，做后期处理，比如计算破坏等等
        postSolve: function () {

        },

        // 结束碰撞，删除一个shape时也会调用
        separate: function () {

        }
    });
})();


CREATE_FUNC(PhysicsWorld);