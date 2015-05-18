/**
 * Created by baidu on 15/5/10.
 */

class LightShape extends egret.Shape{

    public limiter: boolean;

    public constructor() {
        super();

        this.limiter = false;

        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchAction,this);
    }

    public doSwich(on?:boolean,animate?:boolean):void{
        if (on == null || on == undefined){
            on = !this.limiter;
        }
        if (animate == null || animate == undefined){
            animate = true;
        }

        if(on){
            //0x5dcefe
            if(animate) {
                egret.Tween.get(this).to({alpha: 1.0}, 500, egret.Ease.circInOut);
            }else{
                this.alpha = 1.0;
            }
        }else{
            //0x00505f
            if(animate) {
                egret.Tween.get(this).to({alpha: 0.08}, 500, egret.Ease.circInOut);
            }else{
                this.alpha = 0.08;
            }
        }
        if(animate) {
            egret.Tween.get(this).to({scaleX: 1.1, scaleY: 1.1}, 200, egret.Ease.circInOut)
                .to({scaleX: 1.0, scaleY: 1.0}, 200, egret.Ease.circInOut);
        }

        this.limiter = on;
    }

    public touchAction(evt:egret.TouchEvent):void{
        var top:LightShape = null;
        var left:LightShape = null;
        var bottom:LightShape = null;
        var right:LightShape = null;

        var index:number = this.parent.getChildIndex(this);
        if(index > 5){
            top = <LightShape>this.parent.getChildAt(index-5);
        }
        if(index < 5*(5-1)){
            bottom = <LightShape>this.parent.getChildAt(index+5);
        }
        if(index%5 > 0){
            left = <LightShape>this.parent.getChildAt(index-1);
        }
        if(index%5 < (5-1)){
            right = <LightShape>this.parent.getChildAt(index+1);
        }

        console.log("top:",top,"left:",left,"bottom:",bottom,"right:",right);
        console.log("index:",index);

        this.doSwich();
        if(top != null){
            top.doSwich();
        }
        if(left != null) {
            left.doSwich();
        }
        if(bottom != null){
            bottom.doSwich();
        }
        if(right != null){
            right.doSwich();
        }
    }
}