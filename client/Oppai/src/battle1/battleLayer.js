/**
 * Created by lcc3536 on 14-5-22.
 */


var BattleLayer = cc.Layer.extend({
    _map: null,
    _hero: null,
    _robots: null,
    _actors: null,
    _direction: null,
    _isEnd: false,

    onEnter: function () {
        this._super();
    },

    onExit: function () {
        this._super();

        this.unscheduleUpdate();
    },

    init: function () {
        cc.log("BattleLayer init");

        if (!this._super()) return false;

        this._map = null;
        this._hero = null;
        this._actors = null;
        this.direction = cc.p(0, 0);
        this._isEnd = false;

        cc.spriteFrameCache.addSpriteFrames(res.pd_sprites_plist);
        this._actors = cc.SpriteBatchNode.create(res.pd_sprites);
        this.addChild(this._actors, -5);

        this.initMap();
        this.initHero();
        this.initRobots();

        this.setEvent();

        this.scheduleUpdate();

        return true;
    },

    initMap: function () {
        cc.log("BattleLayer initMap");

        this._map = cc.TMXTiledMap.create(res.pd_tilemap_tmx);
        this.addChild(this._map, -6);
    },

    initHero: function () {
        cc.log("BattleLayer initHero");

        this._hero = Hero.create();

        this._actors.addChild(this._hero);
        this._hero.setPosition(cc.p(this._hero._centerToSides, 80));
        this._hero._desiredPosition = this._hero.getPosition();
        this._hero.idle();
    },

    initRobots: function () {
        cc.log("BattleLayer initRobots");

        var count = 25;
        var mapSize = this._map.getMapSize();
        var tileSize = this._map.getTileSize();

        this._robots = [];

        for (var i = 0; i < count; ++i) {
            var robot = Robot.create();

            var minX = cc.winSize.width + robot._centerToSides;
            var maxX = mapSize.width * tileSize.width - robot._centerToSides;

            var minY = robot._centerToBottom;
            var maxY = 3 * tileSize.height + robot._centerToBottom;

            robot.scaleX = -1;
            robot.setPosition(_.random(minX, maxX), _.random(minY, maxY));
            robot._desiredPosition = robot.getPosition();
            robot.idle();

            this._actors.addChild(robot);

            this._robots.push(robot);
        }
    },

    update: function (dt) {
        this.updateHero(dt);
        this.updateRobots(dt);
        this.updatePositions();
        this.updateActors(dt);
        this.updateViewCenter();
    },

    updateHero: function (dt) {
        this._hero.update(dt);
    },

    updateRobots: function (dt) {
        var total = 0, randomChoice;

        var len = this._robots.length;
        for (i = 0; i < len; ++i) {
            var robot = this._robots[i];

            robot.update(dt);

            if (this._hero._status != HERO_STATUS_CONFIG.DIED && robot._status != HERO_STATUS_CONFIG.DIED) {
                total += 1;

                if (_.now() > robot._nextDecisionTime) {
                    var distanceSQ = cc.pDistanceSQ(robot.getPosition(), this._hero.getPosition());

                    if (distanceSQ <= 50 * 50) {
                        robot._nextDecisionTime = _.now() + _.rand(0.1, 0.5) * MILLISECONDS_TO_SECONDS;

                        randomChoice = _.random(1);

                        if (randomChoice == 0) {
                            if (this._hero.getPosition().x > robot.getPosition.x) {
                                robot.scaleX = 1.0;
                            } else {
                                robot.scaleX = -1;
                            }

                            robot._nextDecisionTime = robot._nextDecisionTime + _.random(0.1, 0.5) * 2000;
                            robot.attack();

                            if (robot._status == HERO_STATUS_CONFIG.ATTACK) {
                                if (Math.abs(this._hero.getPosition().y - robot.getPosition().y) < 10) {
                                    if (cc.rectIntersectsRect(robot._attackBox.actual, this._hero._hitBox.actual)) {
                                        this._hero.hurt(robot._damage);

                                        if (this._hero._status == HERO_STATUS_CONFIG.DIED) {
                                            this.endGame();
                                        }
                                    }
                                }
                            }
                        } else {
                            robot.idle();
                        }
                    } else if (distanceSQ <= cc.winSize.width * cc.winSize.width) {
                        robot._nextDecisionTime = _.now() + _.random(0.5, 1.0) * 1000;
                        randomChoice = _.random(2);

                        if (randomChoice == 0) {
                            var moveDirection = cc.pNormalize(cc.pSub(this._hero.getPosition(), robot.getPosition()));
                            robot.move(moveDirection);
                        } else {
                            robot.idle();
                        }
                    }
                }
            }
        }

        if (total == 0) {
            this.endGame();
        }
    },

    updateActors: function () {
        var mapSize = this._map.getMapSize();
        var tileSize = this._map.getTileSize();
        var children = this._actors.getChildren();
        var height = mapSize.height * tileSize.height;
        var len = children.length;

        for (var i = 0; i < len; ++i) {
//            children[i].setLocalZOrder(
//                height - children[i].getPosition().y
//            );
            this._actors.reorderChild(children[i], height - children[i].getPosition().y);
        }
    },

    updatePositions: function () {
        var mapSize = this._map.getMapSize();
        var tileSize = this._map.getTileSize();
        var children = this._actors.getChildren();
        var width = mapSize.width * tileSize.width;
        var height = 3 * tileSize.height;
        var len = children.length;
        var heroX = this._hero.getPosition().x;

        for (var i = 0; i < len; ++i) {
            var child = children[i];

            if (child._status != HERO_STATUS_CONFIG.DIED) {
                var posX = _.min([
                    width - child._centerToSides,
                    _.max([child._centerToSides, child._desiredPosition.x])
                ]);

                var posY = _.min([
                    height + child._centerToBottom,
                    _.max([child._centerToBottom, child._desiredPosition.y])
                ]);

                child.setPosition(cc.p(posX, posY));

                if (child._status != HERO_STATUS_CONFIG.MOVE) {
                    if (posX > heroX) {
                        child.scaleX = -1.0;
                    }

                    if (posX < heroX) {
                        child.scaleX = 1.0;
                    }
                }
            }
        }
    },

    updateViewCenter: function () {
        var position = this._hero.getPosition();
        var mapSize = this._map.getMapSize();
        var tileSize = this._map.getTileSize();

        var x = _.max([position.x, cc.winSize.width / 2]);
        var y = _.max([position.y, cc.winSize.height / 2]);

        x = _.min([x, mapSize.width * tileSize.width - cc.winSize.width / 2]);
        y = _.min([y, mapSize.height * tileSize.height - cc.winSize.height / 2]);

        var viewPoint = cc.pSub(cc.winCenter, cc.p(x, y));

        this.setPosition(viewPoint);
    },

    endGame: function () {
        if (!this._isEnd) {
            this._isEnd = true;

            var resetItem = cc.MenuItemFont.create("Game start", this.startGame, this);
            var menu = cc.Menu.create(resetItem);
            this.getParent().addChild(menu);
        }
    },

    startGame: function () {
        cc.director.runScene(BattleScene.create());
    },

    didChangeDirectionTo: function () {
        this._hero.move(this._direction);
    },

    setEvent: function () {
        cc.log("BattleLayer setEvent");

        if ("keyboard" in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: this.onKeyPressed,
                onKeyReleased: this.onKeyReleased
            }, this)
        } else {
            cc.error("keyboard not supported");
        }
    },

    onKeyPressed: function (key, event) {
//        cc.log("Key down: " + key);
//        cc.log("Event: ");
//        cc.log(event);

        var target = event.getCurrentTarget();

        key = parseInt(key);

        if (_.indexOf(KEYBOARD_CONFIG.ATTACK, key) != -1) {
            target._hero.attack();

            if (target._hero._status == HERO_STATUS_CONFIG.ATTACK) {
                var len = target._robots.length;
                for (var i = 0; i < len; ++i) {
                    var robot = target._robots[i];

                    if (robot._status != HERO_STATUS_CONFIG.DIED) {
                        if (Math.abs(target._hero.getPosition().y - robot.getPosition().y) < 10) {

                            if (cc.rectIntersectsRect(target._hero._attackBox.actual, robot._hitBox.actual)) {
                                robot.hurt(target._hero._damage);
                            }
                        }
                    }
                }
            }
        }

        if (_.indexOf(KEYBOARD_CONFIG.UP, key) != -1) {
            target._direction = cc.p(0, 1.0);
            target.didChangeDirectionTo(target._direction);
        }

        if (_.indexOf(KEYBOARD_CONFIG.DOWN, key) != -1) {
            target._direction = cc.p(0, -1.0);
            target.didChangeDirectionTo(target._direction);
        }

        if (_.indexOf(KEYBOARD_CONFIG.LEFT, key) != -1) {
            target._direction = cc.p(-1.0, 0);
            target.didChangeDirectionTo(target._direction);
        }

        if (_.indexOf(KEYBOARD_CONFIG.RIGHT, key) != -1) {
            target._direction = cc.p(1.0, 0);
            target.didChangeDirectionTo(target._direction);
        }
    },

    onKeyReleased: function (key, event) {
//        cc.log("Key up: " + key);
//        cc.log("Event: ");
//        cc.log(event);

        var target = event.getCurrentTarget();

        if (target._hero._status === HERO_STATUS_CONFIG.MOVE) {
            target._hero.idle();
        }
    }
});


CREATE_FUNC(BattleLayer);