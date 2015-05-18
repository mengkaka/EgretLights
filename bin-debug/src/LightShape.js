/**
 * Created by baidu on 15/5/10.
 */
var LightShape = (function (_super) {
    __extends(LightShape, _super);
    function LightShape() {
        _super.call(this);
        this.limiter = false;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchAction, this);
    }
    var __egretProto__ = LightShape.prototype;
    __egretProto__.doSwich = function (on, animate) {
        if (on == null || on == undefined) {
            on = !this.limiter;
        }
        if (animate == null || animate == undefined) {
            animate = true;
        }
        if (on) {
            //0x5dcefe
            if (animate) {
                egret.Tween.get(this).to({ alpha: 1.0 }, 500, egret.Ease.circInOut);
            }
            else {
                this.alpha = 1.0;
            }
        }
        else {
            //0x00505f
            if (animate) {
                egret.Tween.get(this).to({ alpha: 0.08 }, 500, egret.Ease.circInOut);
            }
            else {
                this.alpha = 0.08;
            }
        }
        if (animate) {
            egret.Tween.get(this).to({ scaleX: 1.1, scaleY: 1.1 }, 200, egret.Ease.circInOut).to({ scaleX: 1.0, scaleY: 1.0 }, 200, egret.Ease.circInOut);
        }
        this.limiter = on;
    };
    __egretProto__.touchAction = function (evt) {
        var top = null;
        var left = null;
        var bottom = null;
        var right = null;
        var index = this.parent.getChildIndex(this);
        if (index > 5) {
            top = this.parent.getChildAt(index - 5);
        }
        if (index < 5 * (5 - 1)) {
            bottom = this.parent.getChildAt(index + 5);
        }
        if (index % 5 > 0) {
            left = this.parent.getChildAt(index - 1);
        }
        if (index % 5 < (5 - 1)) {
            right = this.parent.getChildAt(index + 1);
        }
        console.log("top:", top, "left:", left, "bottom:", bottom, "right:", right);
        console.log("index:", index);
        this.doSwich();
        if (top != null) {
            top.doSwich();
        }
        if (left != null) {
            left.doSwich();
        }
        if (bottom != null) {
            bottom.doSwich();
        }
        if (right != null) {
            right.doSwich();
        }
    };
    return LightShape;
})(egret.Shape);
LightShape.prototype.__class__ = "LightShape";
