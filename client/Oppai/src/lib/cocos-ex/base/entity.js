/**
 * Created by lcc3536 on 14-5-15.
 */


cc.ex = cc.ex || {};

cc.ex.Entity = (function () {
    return cc.ex.Event.extend({
        set: function (name, value) {
            if (typeof value != "undefined") {
                if (this[name] !== value) {
                    this[name] = value;
                }

                this.emit(name + "Change");
            }
        },

        sets: function (attrs) {
            var key;

            for (key in attrs) {
                this.set(key, attrs[key]);
            }
        },

        add: function (name, value) {
            if (typeof value != "undefined") {
                if (value) {
                    this.set(name, this[name] + value);
                }
            }
        },

        adds: function (attrs) {
            var key;

            for (key in attrs) {
                this.add(key, attrs[key]);
            }
        },

        get: function (name) {
            return this[name];
        },

        has: function (name) {
            return (typeof (this[name]) != "undefined");
        },

        schedule: function (fn, interval, repeat, delay) {
            interval = interval || 0;
            repeat = (repeat == null) ? cc.REPEAT_FOREVER : repeat;
            delay = delay || 0;

            cc.director.getScheduler().scheduleCallbackForTarget(this, fn, interval, repeat, delay, false);
        },

        scheduleOnce: function (fn, delay) {
            this.schedule(fn, 0.0, 0, delay);
        },

        unschedule: function (fn) {
            // explicit nil handling
            cc.director.getScheduler().unscheduleCallbackForTarget(this, fn);
        },

        unscheduleAllCallbacks: function () {
            cc.director.getScheduler().unscheduleAllCallbacksForTarget(this);
        }
    });
})();




