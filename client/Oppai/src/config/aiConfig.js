/**
 * Created by lcc3536 on 14-7-5.
 */


var AI_CONFIG = {
    1: {
        ACTIONS: [
            {TIME: 3000},
            {SOLDIER: 100},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 7000},
            {SOLDIER: 100},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 7000},
            {SOLDIER: 100},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 10000},
            {SOLDIER: 110},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 4000},
            {SOLDIER: 111},
            {TIME: 12000},
            {SOLDIER: 100},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 3000},
            {SOLDIER: 110},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 1000},
            {SOLDIER: 111}
        ]
    },
    2: {
        ACTIONS: [
            {TIME: 3000},
            {SOLDIER: 100},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 8000},
            {SOLDIER: 110},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 4000},
            {SOLDIER: 111},
            {TIME: 12000},
            {SOLDIER: 120},
            {TIME: 1000},
            {SOLDIER: 110},
            {TIME: 4000},
            {SOLDIER: 121}
        ]
    },
    3: {
        ACTIONS: [
            {TIME: 3000},
            {SOLDIER: 110},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 4000},
            {SOLDIER: 111},
            {TIME: 10000},
            {SOLDIER: 120},
            {TIME: 1000},
            {SOLDIER: 110},
            {TIME: 4000},
            {SOLDIER: 121},
            {TIME: 15000},
            {SOLDIER: 130},
            {TIME: 1000},
            {SOLDIER: 120},
            {TIME: 4000},
            {SOLDIER: 131}
        ]
    },
    4: {
        HERO_ID: 1,
        LOOP: -1,
        ACTIONS: [
            {TIME: 1000},
            {SKILL: 0},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 1000},
            {SOLDIER: 100},
            {SKILL: 1},
            {TIME: 8000},
            {SOLDIER: 100},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 8000},
            {SKILL: 2},
            {SOLDIER: 110},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 4000},
            {SOLDIER: 111},
            {SKILL: 0},
            {TIME: 12000},
            {SOLDIER: 120},
            {TIME: 1000},
            {SOLDIER: 110},
            {TIME: 4000},
            {SOLDIER: 121},
            {SKILL: 1},
            {TIME: 16000},
            {SOLDIER: 130},
            {TIME: 1000},
            {SOLDIER: 120},
            {TIME: 4000},
            {SOLDIER: 131},
            {SKILL: 0},
            {TIME: 16000}
        ]
    },
    5: {
        ACTIONS: [
            {TIME: 3000},
            {SOLDIER: 100},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 3000},
            {SOLDIER: 100},
            {TIME: 3000},
            {SOLDIER: 121},
            {TIME: 5000},
            {SOLDIER: 121},
            {TIME: 10000},
            {SOLDIER: 100},
            {TIME: 3000},
            {SOLDIER: 100},
            {TIME: 5000},
            {SOLDIER: 120},
            {TIME: 8000},
            {SOLDIER: 121},
            {TIME: 8000},
            {SOLDIER: 121}
        ]
    },
    6: {
        ACTIONS: [
            {TIME: 3000},
            {SOLDIER: 100},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 5000},
            {SOLDIER: 110},
            {TIME: 3000},
            {SOLDIER: 121},
            {TIME: 3000},
            {SOLDIER: 121},
            {TIME: 12000},
            {SOLDIER: 110},
            {TIME: 3000},
            {SOLDIER: 110},
            {TIME: 3000},
            {SOLDIER: 121},
            {TIME: 1000},
            {SOLDIER: 130},
            {TIME: 1000},
            {SOLDIER: 121}
        ]
    },
    7: {
        ACTIONS: [
            {TIME: 3000},
            {SOLDIER: 111},
            {TIME: 1000},
            {SOLDIER: 111},
            {TIME: 1000},
            {SOLDIER: 111},
            {TIME: 7000},
            {SOLDIER: 111},
            {TIME: 2000},
            {SOLDIER: 121},
            {TIME: 3000},
            {SOLDIER: 130},
            {TIME: 10000},
            {SOLDIER: 120},
            {TIME: 1000},
            {SOLDIER: 120},
            {TIME: 2000},
            {SOLDIER: 121},
            {TIME: 8000},
            {SOLDIER: 120},
            {TIME: 2000},
            {SOLDIER: 120},
            {TIME: 2000},
            {SOLDIER: 121},
            {TIME: 3000},
            {SOLDIER: 131}
        ]
    },
    8: {
        HERO_ID: 1,
        LOOP: -1,
        ACTIONS: [
            {TIME: 2000},
            {SKILL: 1},
            {TIME: 2000},
            {SKILL: 0},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 2000},
            {SKILL: 0},
            {TIME: 2000},
            {SOLDIER: 100},
            {TIME: 5000},
            {SOLDIER: 100},
            {TIME: 2000},
            {SOLDIER: 111},
            {TIME: 2000},
            {SKILL: 1},
            {TIME: 3000},
            {SKILL: 0},
            {TIME: 6000},
            {SOLDIER: 111},
            {TIME: 4000},
            {SKILL: 1},
            {TIME: 4000},
            {SOLDIER: 130},
            {TIME: 2000},
            {SOLDIER: 110},
            {TIME: 6000},
            {SKILL: 1},
            {TIME: 6000},
            {SOLDIER: 100},
            {TIME: 2000},
            {SOLDIER: 121},
            {TIME: 2000},
            {SKILL: 2},
            {TIME: 3000},
            {SKILL: 1},
            {TIME: 3000},
            {SKILL: 0},
            {TIME: 4000},
            {SOLDIER: 131},
            {TIME: 4000},
            {SOLDIER: 110},
            {TIME: 4000},
            {SOLDIER: 120}
        ]
    },
    9: {
        ACTIONS: [
            {TIME: 3000},
            {SOLDIER: 100},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 7000},
            {SOLDIER: 110},
            {TIME: 1000},
            {SOLDIER: 120},
            {TIME: 10000},
            {SOLDIER: 110},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 4000},
            {SOLDIER: 111},
            {TIME: 12000},
            {SOLDIER: 100},
            {TIME: 1000},
            {SOLDIER: 110},
            {TIME: 3000},
            {SOLDIER: 120},
            {TIME: 1000},
            {SOLDIER: 111},
            {TIME: 1000},
            {SOLDIER: 121}
        ]
    },
    10: {
        ACTIONS: [
            {TIME: 3000},
            {SOLDIER: 100},
            {TIME: 1000},
            {SOLDIER: 110},
            {TIME: 7000},
            {SOLDIER: 110},
            {TIME: 1000},
            {SOLDIER: 120},
            {TIME: 4000},
            {SOLDIER: 111},
            {TIME: 11000},
            {SOLDIER: 120},
            {TIME: 1000},
            {SOLDIER: 110},
            {TIME: 4000},
            {SOLDIER: 121}
        ]
    },
    11: {
        ACTIONS: [
            {TIME: 3000},
            {SOLDIER: 110},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 4000},
            {SOLDIER: 111},
            {TIME: 10000},
            {SOLDIER: 120},
            {TIME: 1000},
            {SOLDIER: 110},
            {TIME: 4000},
            {SOLDIER: 121},
            {TIME: 15000},
            {SOLDIER: 120},
            {TIME: 2000},
            {SOLDIER: 120},
            {TIME: 4000},
            {SOLDIER: 130},
            {TIME: 1000},
            {SOLDIER: 131}
        ]
    },
    12: {
        HERO_ID: 1,
        LOOP: -1,
        ACTIONS: [
            {TIME: 1000},
            {SKILL: 0},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 1000},
            {SOLDIER: 100},
            {SKILL: 1},
            {TIME: 8000},
            {SOLDIER: 100},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 4000},
            {SOLDIER: 131},
            {TIME: 8000},
            {SKILL: 2},
            {SOLDIER: 110},
            {TIME: 1000},
            {SOLDIER: 100},
            {TIME: 4000},
            {SOLDIER: 111},
            {SKILL: 0},
            {TIME: 10000},
            {SOLDIER: 120},
            {TIME: 1000},
            {SOLDIER: 110},
            {TIME: 4000},
            {SOLDIER: 121},
            {SKILL: 1},
            {TIME: 16000},
            {SOLDIER: 130},
            {TIME: 1000},
            {SOLDIER: 120},
            {TIME: 4000},
            {SOLDIER: 131},
            {SKILL: 0},
            {TIME: 16000}
        ]
    }
};