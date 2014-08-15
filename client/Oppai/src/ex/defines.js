/**
 * Created by lcc3536 on 14-6-28.
 */


var op = op || {};

op.EPSILON = 0.01;

op.underscoreNameToHumpName = function (underscoreName) {
    cc.assert(underscoreName != null && typeof(underscoreName) === "string", "underscore name to hump name error");

    underscoreName = underscoreName.toLocaleLowerCase();

    var humpName = "";
    var temp = "";
    var flag = false;
    var len = underscoreName.length;


    for (var i = 0; i < len; ++i) {
        temp = underscoreName[i];

        if (temp === "_") {
            flag = true;
        } else {
            if (flag) {
                flag = false;

                temp = temp.toLocaleUpperCase();
            }

            humpName += temp;
        }
    }

    return humpName;
};

op.attr = function (obj, attr) {
    cc.assert(typeof(obj) === "object" && typeof(attr) === "object", "set att error");

    for (var key in attr) {
        var pro = op.underscoreNameToHumpName(key);

        if (obj[pro] != null) {
            cc.log("op attr set pro warnings, obj[pro] is " + JSON.stringify(obj[pro]));
        }

        obj[pro] = attr[key];
    }

    return obj;
};

