/**
 * Created by lcc3536 on 14-7-29.
 */


(function () {
    var SOUNd_BONE_NAME = "sound";

    op.addFrameEvent(function (bone, evt, originFrameIndex, currentFrameIndex) {
        if (bone.name == SOUNd_BONE_NAME) {
            if (sound && res[evt]) {
                sound.playEffect(res[evt]);
            } else {
                cc.warn(evt);
            }
        }
    });
})();