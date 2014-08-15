/**
 * Created by lcc3536 on 14-6-12.
 */


var HERO_SKILL_TYPE_CONFIG = {
    DEFAULT: 0,     // 默认
    BOMBARD: 1,     // 炮击
    CURE: 2,        // 加血
    LASER: 3        // 激光
};

var HERO_SKILL_TARGET_CONFIG = {
    DEFAULT: 0,
    OWN: 1,
    ENEMY: 2,
    ALL: 3
};

var HERO_SKILL_CONFIG = {
    1: {
        RES_ID: 1,
        TYPE: HERO_SKILL_TYPE_CONFIG.BOMBARD,
        TARGET: HERO_SKILL_TARGET_CONFIG.ENEMY,
        MASS: 100,
        MIN_ROTATION: 0,
        MAX_ROTATION: 90,
        RANGE: 60,
        CD: 6000,
        SP_COST: 25,

        DAMAGE_PROPORTION: 400,
        BUFF_ID: BUFF_CONFIG.STUN,
        BUFF_DURATION: 3000
    },
    2: {
        RES_ID: 2,
        TYPE: HERO_SKILL_TYPE_CONFIG.BOMBARD,
        TARGET: HERO_SKILL_TARGET_CONFIG.ENEMY,
        MASS: 200,
        MIN_ROTATION: 0,
        MAX_ROTATION: 90,
        RANGE: 180,
        CD: 12000,
        SP_COST: 35,

        DAMAGE_PROPORTION: 1400
    },
    3: {
        RES_ID: 3,
        TYPE: HERO_SKILL_TYPE_CONFIG.CURE,
        TARGET: HERO_SKILL_TARGET_CONFIG.OWN,
        MASS: 300,
        RANGE: 100,
        CD: 10000,
        SP_COST: 30,
        MIN_ROTATION: 0,
        MAX_ROTATION: 90,

        RECOVERY: 300
    }
};