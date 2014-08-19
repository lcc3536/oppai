/**
 * Created by lcc3536 on 14-6-9.
 */


/**
 * smallest such that 1.0+FLT_EPSILON != 1.0
 * @constant
 * @type Number
 */

ccs.ENABLE_PHYSICS_SAVE_CALCULATED_VERTEX = true;

var op = op || {};

op.v = cc.p;
op.a = cc.p;
op.f = cc.p;

op.getLV = function (v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
};

op.pInPoly = function (poly, p) {
    var oddNodes = false;
    var x = p.x;
    var y = p.y;
    var vi, vj;
    var len = poly.length;
    var i;
    var j = len - 1;

    for (i = 0; i < len; ++i) {
        vi = poly[i];
        vj = poly[j];

        if ((vi.y < y && vj.y >= y || vj.y < y && vi.y >= y) && (vi.x <= x || vj.x <= x)) {
            oddNodes ^= (vi.x + (y - vi.y) / (vj.y - vi.y) * (vj.x - vi.x) < x);
        }

        j = i;
    }

    return oddNodes;
};

op.pToLineSQ = function (p, p1, p2) {
    var x = p.x;
    var y = p.y;

    var a = p2.y - p1.y;
    var b = p1.x - p2.x;
    var c = p2.x * p1.y - p1.x * p2.y;

    return (Math.pow(a * x + b * y + c, 2) / (a * a + b * b));
};

op.pToLine = function (p, p1, p2) {
    return Math.sqrt(op.pToLine(p, p1, p2));
};

op.pToSegmentSQ = function (p, p1, p2) {
    var d1 = cc.pDistanceSQ(p1, p2);
    var d2 = cc.pDistanceSQ(p, p1);
    var d3 = cc.pDistanceSQ(p, p2);

    if (d1 < op.EPSILON) {
        return d2;
    }

    if (d2 < op.EPSILON || d3 < op.EPSILON) {
        return 0;
    }

    if (d3 >= d1 + d2) {
        return d2;
    }

    if (d2 >= d1 + d3) {
        return d3;
    }

    return op.pToLineSQ(p, p1, p2);
};

op.pToSegment = function (p, p1, p2) {
    return Math.sqrt(op.pToSegmentSQ(p, p1, p2));
};

op.pInArmature = function (armature, point) {
    var dict = armature.getBoneDic();

    for (var key in dict) {
        var bodyList = dict[key].getColliderBodyList() || [];
        for (var i = 0; i < bodyList.length; ++i) {
            if (op.pInPoly(bodyList[i].getCalculatedVertexList(), point)) {
                return true;
            }
        }
    }

    return false;
};

op.pToArmatureShorterRange = function (armature, point, range) {
    var dict = armature.getBoneDic();
    var rangeSQ = range * range;

    var bone, bodyList, body, vertexList, len;

    for (var key in dict) {
        bone = dict[key];
        bodyList = bone.getColliderBodyList() || [];

        for (var j = 0; j < bodyList.length; ++j) {
            body = bodyList[j];
            vertexList = body.getCalculatedVertexList();

            len = vertexList.length;
            if (len > 2) {
                for (var k = 1; k < len; ++k) {
                    if (op.pToSegmentSQ(point, vertexList[k - 1], vertexList[k]) < rangeSQ) {
                        return true
                    }
                }
            }
        }
    }

    return false;
};