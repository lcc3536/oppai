/**
 * Created by lcc3536 on 14-7-29.
 */


var sound = (function () {
    var Sound = cc.ex.Entity.extend({
        playMusic: function (url, loop) {
            if (loop == null) {
                loop = false;
            }

            cc.audioEngine.playMusic(url, loop);
        },

        stopMusic: function () {
            cc.audioEngine.stopMusic();
        },

        playEffect: function (url, loop) {
            if (loop == null) {
                loop = false;
            }

            cc.audioEngine.playEffect(url, loop);
        }
    });

    CREATE_FUNC(Sound);

    return (Sound.create());
})();