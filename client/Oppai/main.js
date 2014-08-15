cc.game.onStart = function () {
    cc.view.setDesignResolutionSize(1136, 640, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);

    cc.ex.onStart();

    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        op.load();

        cc.director.runScene(MainScene.create());
    }, this);
};

cc.game.run();
