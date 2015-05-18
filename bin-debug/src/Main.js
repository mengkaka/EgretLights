///<reference path="../libs/core/core.d.ts"/>
/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var __egretProto__ = Main.prototype;
    __egretProto__.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * confiuration file loading is completed, start to pre-load the preload resource group
     */
    __egretProto__.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("level");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    __egretProto__.onResourceLoadComplete = function (event) {
        if (event.groupName == "level") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    };
    /**
    * 资源组加载出错
     *  The resource group loading failed
    */
    __egretProto__.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    __egretProto__.onResourceProgress = function (event) {
        if (event.groupName == "level") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    __egretProto__.createGameScene = function () {
        this.currentLevel = 1;
        this.currentSteps = 0;
        var bg = new egret.Shape;
        bg.graphics.beginFill(0x1c2428);
        bg.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        bg.graphics.endFill();
        this.addChild(bg);
        //底部内容
        this.bottomBar = new egret.Sprite();
        this.bottomBar.x = 0;
        this.bottomBar.y = this.stage.stageHeight - 100;
        this.bottomBar.width = this.stage.stageWidth;
        this.bottomBar.height = 150;
        this.bottomBar.graphics.beginFill(0x10505f, 0.5);
        this.bottomBar.graphics.drawRect(0, 0, this.bottomBar.width, this.bottomBar.height);
        this.bottomBar.graphics.endFill();
        this.addChild(this.bottomBar);
        this.createControls();
        //sprite容器
        this.spriteContainer = new egret.DisplayObjectContainer();
        this.spriteContainer._setX(0);
        this.spriteContainer._setY(0);
        this.spriteContainer._setWidth(this.stage.stageWidth);
        this.spriteContainer._setHeight(this.stage.stageHeight - this.bottomBar.height);
        this.addChild(this.spriteContainer);
        this.resetSprites();
    };
    __egretProto__.createControls = function () {
        //层级标题
        var level = new egret.TextField;
        level.text = "Level";
        level.x = 30;
        level.y = 15;
        level.size = 32;
        level.textColor = 0xd3d3d3;
        level.width = 100;
        level.textAlign = egret.HorizontalAlign.LEFT;
        this.bottomBar.addChild(level);
        //层级数字
        this.levelTextField = new egret.TextField;
        this.levelTextField.text = this.currentLevel.toString();
        this.levelTextField.x = 30;
        this.levelTextField.y = 60;
        this.levelTextField.size = 32;
        this.levelTextField.width = 100;
        this.levelTextField.textAlign = egret.HorizontalAlign.LEFT;
        this.bottomBar.addChild(this.levelTextField);
        //步骤标题
        var steps = new egret.TextField;
        steps.text = "Steps";
        steps.x = this.bottomBar.width - 30 - 100;
        steps.y = 15;
        steps.size = 32;
        steps.textColor = 0xd3d3d3;
        steps.width = 100;
        steps.textAlign = egret.HorizontalAlign.RIGHT;
        this.bottomBar.addChild(steps);
        //步骤数字
        this.stepsTextField = new egret.TextField;
        this.stepsTextField.text = this.currentSteps.toString();
        this.stepsTextField.x = this.bottomBar.width - 30 - 100;
        this.stepsTextField.y = 60;
        this.stepsTextField.size = 32;
        this.stepsTextField.width = 100;
        this.stepsTextField.textAlign = egret.HorizontalAlign.RIGHT;
        this.bottomBar.addChild(this.stepsTextField);
        //重置按钮
        var reset = new egret.TextField;
        reset.text = "Reset";
        reset.y = 30;
        reset.size = 40;
        reset.textAlign = egret.HorizontalAlign.CENTER;
        this.bottomBar.addChild(reset);
        reset.x = (this.bottomBar.width - reset.width) / 2;
        reset._setTextColor(0x00ff55);
        reset.touchEnabled = true;
        reset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.resetCurrentLevel, this);
    };
    __egretProto__.resetCurrentLevel = function (vet) {
        this.currentSteps = 0;
        this.stepsTextField.text = this.currentSteps.toString();
        this.resetSprites();
    };
    __egretProto__.resetSprites = function () {
        var numberOfLine = 5;
        var numberOfRaw = 5;
        var lineSpacing = 18;
        var rawSpacing = 18;
        var insetWith = 20;
        //删除所有子视图
        this.spriteContainer.removeChildren();
        var spriteWidth = (this.spriteContainer.width - insetWith * 2 - (numberOfRaw - 1) * rawSpacing) / numberOfRaw;
        var startX = insetWith;
        var startY = (this.spriteContainer.height - spriteWidth * numberOfLine - (numberOfLine - 1) * lineSpacing) / 2.0;
        var levelInfo = RES.getRes("level");
        var level = this.currentLevel;
        if (level > 27) {
            level = (level % 28) + 1;
        }
        var currentLevel = levelInfo[level.toString()];
        for (var i = 0; i < numberOfLine; i++) {
            for (var j = 0; j < numberOfRaw; j++) {
                var sprite = new LightShape();
                sprite._setX(startX + j * (spriteWidth + rawSpacing) + spriteWidth / 2.0);
                sprite._setY(startY + i * (spriteWidth + lineSpacing) + spriteWidth / 2.0);
                sprite._setWidth(spriteWidth);
                sprite._setHeight(spriteWidth);
                sprite.graphics.beginFill(0x5dcefe);
                sprite.graphics.drawCircle(spriteWidth / 2, spriteWidth / 2, spriteWidth / 2);
                sprite.graphics.endFill();
                var flag = currentLevel.substr(i * numberOfRaw + j, 1);
                sprite.doSwich((parseInt(flag) == 0) ? false : true, false);
                this.spriteContainer.addChild(sprite);
                sprite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.checkStatusAction, this);
            }
        }
    };
    //检查是否过关
    __egretProto__.checkStatusAction = function (evt) {
        var t = true;
        var childrenCount = this.spriteContainer._children.length;
        for (var i = 0; i < childrenCount; i++) {
            var sprite = this.spriteContainer.getChildAt(i);
            if (sprite.limiter == true) {
                t = false;
                break;
            }
        }
        this.updateLabelText(t);
        if (t == true) {
            egret.Tween.get(this.spriteContainer).to({ alpha: 0.0 }, 600, egret.Ease.circIn).call(function () {
                this.resetSpriteWithCurrentLevel();
            }, this).wait(300).to({ alpha: 1 }, 600, egret.Ease.circOut);
        }
    };
    //重置当前显示等级
    __egretProto__.resetSpriteWithCurrentLevel = function () {
        this.resetSprites();
        this.currentSteps = 0;
        this.stepsTextField.text = this.currentSteps.toString();
    };
    //更新显示内容
    __egretProto__.updateLabelText = function (newLevel) {
        if (newLevel) {
            this.currentLevel++;
            this.levelTextField.text = this.currentLevel.toString();
            this.currentSteps = 0;
            this.stepsTextField.text = this.currentSteps.toString();
        }
        else {
            this.currentSteps++;
            if (this.currentSteps > 10000) {
                this.resetCurrentLevel();
                return;
            }
            this.stepsTextField.text = this.currentSteps.toString();
        }
    };
    return Main;
})(egret.DisplayObjectContainer);
Main.prototype.__class__ = "Main";
