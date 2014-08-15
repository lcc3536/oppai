/**
 * Created by lcc3536 on 14-6-28.
 */


var op = op || {};

(function () {
    var heroPrefix = "hero_";
    var soldierPrefix = "soldier_";
    var missilePrefix = "missile_";

    var loadHeroRes = function () {
        for (var key in HERO_CONFIG) {
            ccs.armatureDataManager.addArmatureFileInfo(res[heroPrefix + HERO_CONFIG[key].RES_ID]);
        }
    };

    var loadHeroSkillRes = function () {
        for (var key in HERO_SKILL_CONFIG) {
            ccs.armatureDataManager.addArmatureFileInfo(res[missilePrefix + HERO_SKILL_CONFIG[key].RES_ID]);
        }
        ccs.armatureDataManager.addArmatureFileInfo(res.hero_1_bullet);
    };

    var loadSoldierRes = function () {
        for (var key in SOLDIER_CONFIG) {
            ccs.armatureDataManager.addArmatureFileInfo(res[soldierPrefix + SOLDIER_CONFIG[key].RES_ID]);
        }
    };

    var loadSoldierSkillRes = function () {
        ccs.armatureDataManager.addArmatureFileInfo(res.soldier_2_bullet);
        ccs.armatureDataManager.addArmatureFileInfo(res.soldier_3_bullet);
        ccs.armatureDataManager.addArmatureFileInfo(res.soldier_6_bullet);
        ccs.armatureDataManager.addArmatureFileInfo(res.soldier_6_skill);
        ccs.armatureDataManager.addArmatureFileInfo(res.soldier_7_bullet);
        ccs.armatureDataManager.addArmatureFileInfo(res.soldier_11_bullet);
        ccs.armatureDataManager.addArmatureFileInfo(res.soldier_11_skill);
    };

    var loadBuffRes = function () {
        ccs.armatureDataManager.addArmatureFileInfo(res.buff_1000);
    };

    op.load = function () {
        cc.log("-------------------------load start-------------------------");

        loadHeroRes();
        loadHeroSkillRes();
        loadSoldierRes();
        loadSoldierSkillRes();
        loadBuffRes();

        cc.log("-------------------------load end---------------------------");
    };
})();

