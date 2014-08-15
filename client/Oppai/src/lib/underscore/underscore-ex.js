/**
 * Created by lcc3536 on 14-5-15.
 */


var _ = _ || {};

_.judge = _.judge || function (a, b) {
    if (a <= 0 || b <= 0) {
        return false;
    }

    if (b == null) {
        if (a >= 1.0) {
            return true;
        }

        b = 100000000;
        a = Math.round(a * b);
    }

    if (a >= b) {
        return true;
    }

    var randNum = _.random(1, b);

    return (randNum <= a);
};

_.rand = _.rand || function (min, max) {
    if (min == null && max == null) {
        return Math.random();
    }

    if (max == null) {
        max = min;
        min = 0;
    }
    
    return min + Math.random() * (max - min);
};