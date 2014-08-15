/**
 * Created by lcc3536 on 14-6-25.
 */


var SOLDIER_CONFIG = {
    // 我方小兵
    1: {
        STAR: 5,                // 星级
        RES_ID: 5,              // 资源ID
        SP_COST: 30,            // SP消耗
        SP_OUTPUT: 30,          // SP产出
        MAX_HP: 420,            // 生命
        DAMAGE: 22.5,           // 伤害
        CRIT: 150,              // 暴击
        CRIT_MULTIPLE: 1.5,     // 暴击倍数
        DODGE: 5,               // 闪避
        SPEED: 110,             // 移动速度
        RECOVERY: 315,          // 恢复
        ALTITUDE: 0,            // 高度
        CD: 8000,               // 间隔
        SIZE: 1.0,              // 缩放比例

        // 普攻配置
        ATK_ID: 1,              // 普攻ID
        RANGE: 110,             // 攻击距离
        INTERVAL: 2500,         // 攻击间隔

        // 技能配置
        SKILL_ID: 1,            // 技能ID

        ARMOR: 0,               // 护甲
        RESIST: 0,              // 魔抗
        REDUCES_ARMOR: 0,       // 减护甲
        REDUCES_RESIST: 0,      // 减魔抗
        LIFESTEAL: 0            // 吸血
    },
    2: {
        STAR: 5,                // 星级
        RES_ID: 6,              // 资源ID
        SP_COST: 30,            // SP消耗
        SP_OUTPUT: 30,          // SP产出
        MAX_HP: 240,            // 生命
        DAMAGE: 72,             // 伤害
        CRIT: 100,              // 暴击
        CRIT_MULTIPLE: 1.8,     // 暴击倍数
        DODGE: 5,               // 闪避
        SPEED: 80,              // 移动速度
        RECOVERY: 180,          // 恢复
        ALTITUDE: 0,            // 高度
        CD: 8000,               // 间隔
        SIZE: 1.0,              // 缩放比例

        // 普攻配置
        ATK_ID: 2,              // 普攻ID
        RANGE: 350,             // 攻击距离
        INTERVAL: 4000,         // 攻击间隔
        TRAJECTORY: 350,        // 弹道速度

        // 技能配置
        SKILL_ID: 2,            // 技能ID

        ARMOR: 0,               // 护甲
        RESIST: 0,              // 魔抗
        REDUCES_ARMOR: 0,       // 减护甲
        REDUCES_RESIST: 0,      // 减魔抗
        LIFESTEAL: 0            // 吸血
    },
    3: {
        STAR: 5,                // 星级
        RES_ID: 11,             // 资源ID
        SP_COST: 30,            // SP消耗
        SP_OUTPUT: 30,          // SP产出
        MAX_HP: 330,            // 生命
        DAMAGE: 47.25,          // 伤害
        CRIT: 100,              // 暴击
        CRIT_MULTIPLE: 1.5,     // 暴击倍数
        DODGE: 5,               // 闪避
        SPEED: 70,              // 移动速度
        RECOVERY: 248,          // 恢复
        ALTITUDE: 0,            // 高度
        CD: 8000,               // 间隔
        SIZE: 1.0,              // 缩放比例

        // 普攻配置
        ATK_ID: 2,              // 普攻ID
        RANGE: 280,             // 攻击距离
        INTERVAL: 3500,         // 攻击间隔
        TRAJECTORY: 400,        // 弹道速度

        // 技能配置
        SKILL_ID: 3,            // 技能ID

        ARMOR: 0,               // 护甲
        RESIST: 0,              // 魔抗
        REDUCES_ARMOR: 0,       // 减护甲
        REDUCES_RESIST: 0,      // 减魔抗
        LIFESTEAL: 0            // 吸血
    },
    4: {
        STAR: 3,                // 星级
        RES_ID: 1,              // 资源ID
        SP_COST: 25,            // SP消耗
        SP_OUTPUT: 25,          // SP产出
        MAX_HP: 425,            // 生命
        DAMAGE: 15,             // 伤害
        CRIT: 100,              // 暴击
        CRIT_MULTIPLE: 1.5,     // 暴击倍数
        DODGE: 5,               // 闪避
        SPEED: 90,              // 移动速度
        RECOVERY: 319,          // 恢复
        ALTITUDE: 0,            // 高度
        CD: 8000,               // 间隔
        SIZE: 0.7,              // 缩放比例

        // 普攻配置
        ATK_ID: 1,              // 普攻ID
        RANGE: 80,              // 攻击距离
        INTERVAL: 4000,         // 攻击间隔

        // 技能配置

        ARMOR: 0,               // 护甲
        RESIST: 0,              // 魔抗
        REDUCES_ARMOR: 0,       // 减护甲
        REDUCES_RESIST: 0,      // 减魔抗
        LIFESTEAL: 0            // 吸血
    },
    5: {
        STAR: 3,                // 星级
        RES_ID: 3,              // 资源ID
        SP_COST: 20,            // SP消耗
        SP_OUTPUT: 20,          // SP产出
        MAX_HP: 200,            // 生命
        DAMAGE: 30,             // 伤害
        CRIT: 100,              // 暴击
        CRIT_MULTIPLE: 1.5,     // 暴击倍数
        DODGE: 5,               // 闪避
        SPEED: 95,             // 移动速度
        RECOVERY: 150,          // 恢复
        ALTITUDE: 0,            // 高度
        CD: 8000,               // 间隔
        SIZE: 0.7,              // 缩放比例

        // 普攻配置
        ATK_ID: 2,              // 普攻ID
        RANGE: 210,             // 攻击距离
        INTERVAL: 3000,         // 攻击间隔
        TRAJECTORY: 450,        // 弹道速度

        // 技能配置

        ARMOR: 0,               // 护甲
        RESIST: 0,              // 魔抗
        REDUCES_ARMOR: 0,       // 减护甲
        REDUCES_RESIST: 0,      // 减魔抗
        LIFESTEAL: 0            // 吸血
    },

    // AI小兵
    100: {
        STAR: 2,                // 星级
        RES_ID: 9,              // 资源ID
        SP_COST: 15,            // SP消耗
        SP_OUTPUT: 15,          // SP产出
        MAX_HP: 255,            // 生命
        DAMAGE: 9,              // 伤害
        CRIT: 100,              // 暴击
        CRIT_MULTIPLE: 1.5,     // 暴击倍数
        DODGE: 5,               // 闪避
        SPEED: 70,              // 移动速度
        RECOVERY: 128,          // 恢复
        ALTITUDE: 0,            // 高度
        CD: 8000,               // 间隔
        SIZE: 0.7,              // 缩放比例

        // 普攻配置
        ATK_ID: 1,              // 普攻ID
        RANGE: 80,              // 攻击距离
        INTERVAL: 4000,         // 攻击间隔

        // 技能配置

        ARMOR: 0,               // 护甲
        RESIST: 0,              // 魔抗
        REDUCES_ARMOR: 0,       // 减护甲
        REDUCES_RESIST: 0,      // 减魔抗
        LIFESTEAL: 0            // 吸血
    },
    110: {
        STAR: 3,                // 星级
        RES_ID: 10,             // 资源ID
        SP_COST: 20,            // SP消耗
        SP_OUTPUT: 15,          // SP产出
        MAX_HP: 280,            // 生命
        DAMAGE: 24,             // 伤害
        CRIT: 100,              // 暴击
        CRIT_MULTIPLE: 1.5,     // 暴击倍数
        DODGE: 5,               // 闪避
        SPEED: 80,              // 移动速度
        RECOVERY: 140,          // 恢复
        ALTITUDE: 0,            // 高度
        CD: 8000,               // 间隔
        SIZE: 0.7,              // 缩放比例

        // 普攻配置
        ATK_ID: 1,              // 普攻ID
        RANGE: 100,             // 攻击距离
        INTERVAL: 4000,         // 攻击间隔

        // 技能配置

        ARMOR: 0,               // 护甲
        RESIST: 0,              // 魔抗
        REDUCES_ARMOR: 0,       // 减护甲
        REDUCES_RESIST: 0,      // 减魔抗
        LIFESTEAL: 0            // 吸血
    },
    111: {
        STAR: 3,                // 星级
        RES_ID: 4,              // 资源ID
        SP_COST: 20,            // SP消耗
        SP_OUTPUT: 15,          // SP产出
        MAX_HP: 200,            // 生命
        DAMAGE: 30,             // 伤害
        CRIT: 100,              // 暴击
        CRIT_MULTIPLE: 1.5,     // 暴击倍数
        DODGE: 5,               // 闪避
        SPEED: 90,              // 移动速度
        RECOVERY: 100,          // 恢复
        ALTITUDE: 0,            // 高度
        CD: 8000,               // 间隔
        SIZE: 0.7,              // 缩放比例

        // 普攻配置
        ATK_ID: 1,              // 普攻ID
        RANGE: 120,             // 攻击距离
        INTERVAL: 3000,         // 攻击间隔

        // 技能配置

        ARMOR: 0,               // 护甲
        RESIST: 0,              // 魔抗
        REDUCES_ARMOR: 0,       // 减护甲
        REDUCES_RESIST: 0,      // 减魔抗
        LIFESTEAL: 0            // 吸血
    },
    120: {
        STAR: 4,                // 星级
        RES_ID: 8,              // 资源ID
        SP_COST: 25,            // SP消耗
        SP_OUTPUT: 20,          // SP产出
        MAX_HP: 350,            // 生命
        DAMAGE: 30,             // 伤害
        CRIT: 100,              // 暴击
        CRIT_MULTIPLE: 1.5,     // 暴击倍数
        DODGE: 5,               // 闪避
        SPEED: 80,              // 移动速度
        RECOVERY: 175,          // 恢复
        ALTITUDE: 0,            // 高度
        CD: 8000,               // 间隔
        SIZE: 0.8,              // 缩放比例

        // 普攻配置
        ATK_ID: 1,              // 普攻ID
        RANGE: 100,             // 攻击距离
        INTERVAL: 4000,         // 攻击间隔

        // 技能配置

        ARMOR: 0,               // 护甲
        RESIST: 0,              // 魔抗
        REDUCES_ARMOR: 0,       // 减护甲
        REDUCES_RESIST: 0,      // 减魔抗
        LIFESTEAL: 0            // 吸血
    },
    121: {
        STAR: 3,                // 星级
        RES_ID: 3,              // 资源ID
        SP_COST: 25,            // SP消耗
        SP_OUTPUT: 20,          // SP产出
        MAX_HP: 200,            // 生命
        DAMAGE: 45,             // 伤害
        CRIT: 100,              // 暴击
        CRIT_MULTIPLE: 1.5,     // 暴击倍数
        DODGE: 5,               // 闪避
        SPEED: 95,              // 移动速度
        RECOVERY: 100,          // 恢复
        ALTITUDE: 0,            // 高度
        CD: 8000,               // 间隔
        SIZE: 0.7,              // 缩放比例

        // 普攻配置
        ATK_ID: 2,              // 普攻ID
        RANGE: 200,             // 攻击距离
        INTERVAL: 3000,         // 攻击间隔
        TRAJECTORY: 450,        // 弹道速度

        // 技能配置

        ARMOR: 0,               // 护甲
        RESIST: 0,              // 魔抗
        REDUCES_ARMOR: 0,       // 减护甲
        REDUCES_RESIST: 0,      // 减魔抗
        LIFESTEAL: 0            // 吸血
    },
    130: {
        STAR: 5,                // 星级
        RES_ID: 5,              // 资源ID
        SP_COST: 35,            // SP消耗
        SP_OUTPUT: 30,          // SP产出
        MAX_HP: 490,            // 生命
        DAMAGE: 31.5,           // 伤害
        CRIT: 150,              // 暴击
        CRIT_MULTIPLE: 1.5,     // 暴击倍数
        DODGE: 5,               // 闪避
        SPEED: 110,             // 移动速度
        RECOVERY: 245,          // 恢复
        ALTITUDE: 0,            // 高度
        CD: 8000,               // 间隔
        SIZE: 1.2,              // 缩放比例


        // 普攻配置
        ATK_ID: 1,              // 普攻ID
        RANGE: 110,             // 攻击距离
        INTERVAL: 3000,         // 攻击间隔

        // 技能配置

        ARMOR: 0,               // 护甲
        RESIST: 0,              // 魔抗
        REDUCES_ARMOR: 0,       // 减护甲
        REDUCES_RESIST: 0,      // 减魔抗
        LIFESTEAL: 0            // 吸血
    },
    131: {
        STAR: 5,                // 星级
        RES_ID: 7,              // 资源ID
        SP_COST: 40,            // SP消耗
        SP_OUTPUT: 30,          // SP产出
        MAX_HP: 560,            // 生命
        DAMAGE: 72,             // 伤害
        CRIT: 150,              // 暴击
        CRIT_MULTIPLE: 1.5,     // 暴击倍数
        DODGE: 5,               // 闪避
        SPEED: 60,              // 移动速度
        RECOVERY: 280,          // 恢复
        ALTITUDE: 0,            // 高度
        CD: 8000,               // 间隔
        SIZE: 1.0,              // 缩放比例


        // 普攻配置
        ATK_ID: 3,              // 普攻ID
        RANGE: 360,             // 攻击距离
        INTERVAL: 6000,         // 攻击间隔
        DAMAGE_RANGE: 20,       // 伤害范围

        // 技能配置

        ARMOR: 0,               // 护甲
        RESIST: 0,              // 魔抗
        REDUCES_ARMOR: 0,       // 减护甲
        REDUCES_RESIST: 0,      // 减魔抗
        LIFESTEAL: 0            // 吸血
    }
};