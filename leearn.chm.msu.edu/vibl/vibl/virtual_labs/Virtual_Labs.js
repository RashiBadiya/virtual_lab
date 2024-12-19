var Virtual_Labs = ( () => {
    return {
        addGlow(object, glowSize=5) {
            var blurFilter = new createjs.BlurFilter(glowSize,glowSize,1);
            object.filters = [blurFilter];
            var bounds = blurFilter.getBounds();
            object.cache(-50 + bounds.x, -50 + bounds.y, 100 + object.width, 100 + object.height);
        },
        removeGlow(object) {
            object.filters = [];
        },
        tipPopup(myStage, s, eName='tipPopupOK', numCharOrange=0, centerText=false, w=500) {
            var popup = new createjs.MovieClip();
            var messageField = this.createTextField(s, w - 20, numCharOrange, centerText);
            var button = this.createButton('Ok', 110, 35);
            const h = messageField.y + messageField.getMeasuredHeight() + button.height + 45;
            var popupBack = this.createPopup(myStage, w, h);
            var popupBackDrop = new createjs.Shape();
            const stageWidth = myStage.canvas.clientWidth;
            const stageHeight = myStage.canvas.clientHeight;
            var tipPopupClick = function(e) {
                e.currentTarget.stage.dispatchEvent(new Event(eName));
                e.currentTarget.stage.dispatchEvent(new Event(Menu.CLOSE_WINDOW));
                e.currentTarget.stage.removeChild(e.currentTarget.parent.parent);
            };
            button.addEventListener('click', tipPopupClick);
            popupBackDrop.graphics.beginFill('#000000');
            popupBackDrop.graphics.drawRect(0, 0, stageWidth, stageHeight);
            popupBackDrop.graphics.endFill();
            const glow = new createjs.Shape();
            glow.graphics.f('#ffffff').drawRoundRect(0, 0, w, h, 15, 15);
            glow.width = w;
            glow.height = h;
            glow.alpha = 0.2;
            this.addGlow(glow);
            const border = new createjs.Shape();
            border.graphics.ss(5).s('#FF6600').drawRoundRect(0, 0, w, h, 15, 15);
            border.width = w;
            border.height = h;
            this.addGlow(border, 3);
            popup.addChild(popupBack);
            popup.addChild(messageField);
            popup.addChild(glow);
            popup.addChild(border);
            popup.addChild(button);
            var popupMC = new Popup();
            popupBack.x = stageWidth / 2 - popupBack.width / 2;
            glow.x = popupBack.x;
            border.x = popupBack.x;
            popupBack.y = stageHeight / 2 - popupBack.height / 2;
            glow.y = popupBack.y;
            border.y = popupBack.y;
            if (centerText) {
                messageField.x = popupBack.x + popupBack.width / 2;
            } else {
                messageField.x = popupBack.x + (popupBack.width - messageField.lineWidth) / 2;
            }
            messageField.y = popupBack.y + 25;
            button.y = messageField.y + messageField.getMeasuredHeight() + 10;
            button.x = popupBack.x + (popupBack.width - button.width) / 2;
            popupMC.addChild(popupBackDrop);
            popupMC.addChild(popup);
            popupBackDrop.name = 'background';
            popup.name = 'popup';
            popupBackDrop.alpha = 0.5;
            myStage.addChild(popupMC);
            return popupMC;
        },
        tipPopupNoButton(myStage, s, centerText=false, w=500) {
            const numCharOrange = false;
            var popup = new createjs.MovieClip();
            var messageField = this.createTextField(s, w - 20, numCharOrange, centerText);
            const h = messageField.y + messageField.getMeasuredHeight() + 45;
            var popupBack = this.createPopup(myStage, w, h);
            const glow = new createjs.Shape();
            glow.graphics.f('#ffffff').drawRoundRect(0, 0, w, h, 15, 15);
            glow.width = w;
            glow.height = h;
            glow.alpha = 0.2;
            this.addGlow(glow);
            const border = new createjs.Shape();
            border.graphics.ss(5).s('#FF6600').drawRoundRect(0, 0, w, h, 15, 15);
            border.width = w;
            border.height = h;
            this.addGlow(border, 3);
            popup.addChild(popupBack);
            popup.addChild(messageField);
            popup.addChild(glow);
            popup.addChild(border);
            var popupMC = new Popup();
            popupBack.x = 560;
            glow.x = popupBack.x;
            border.x = popupBack.x;
            popupBack.y = 460;
            glow.y = popupBack.y;
            border.y = popupBack.y;
            if (centerText) {
                messageField.x = popupBack.x + popupBack.width / 2;
            } else {
                messageField.x = popupBack.x + (popupBack.width - messageField.lineWidth) / 2;
            }
            messageField.y = popupBack.y + 30;
            popupMC.addChild(popup);
            popup.name = 'popup';
            myStage.addChild(popupMC);
            return popupMC;
        },
        stopPopup(myStage, s, numCharOrange=0, centerText=false, w=500) {
            var popup = new createjs.MovieClip();
            var messageField = this.createTextField(s, w - 20, numCharOrange, centerText);
            var button = this.createButton('Main Menu', 140, 35);
            const h = messageField.y + messageField.getMeasuredHeight() + button.height + 45;
            var popupBack = this.createPopup(myStage, w, h);
            var popupBackDrop = new createjs.Shape();
            const stageWidth = myStage.canvas.clientWidth;
            const stageHeight = myStage.canvas.clientHeight;
            messageField.x = (popupBack.width - messageField.lineWidth) / 2;
            messageField.y = messageField.x;
            button.y = messageField.y + messageField.getMeasuredHeight() + 7;
            button.x = (popupBack.width - button.width) / 2;
            var stopPopupClick = function(e) {
                e.currentTarget.stage.dispatchEvent(new Event('OK'));
                e.currentTarget.stage.dispatchEvent(new Event(Menu.OPEN_MENU));
                e.currentTarget.stage.dispatchEvent(new Event(Menu.CLOSE_WINDOW));
                e.currentTarget.stage.removeChild(e.currentTarget.parent.parent);
            };
            button.addEventListener('click', stopPopupClick);
            popupBackDrop.graphics.beginFill('#000000');
            popupBackDrop.graphics.drawRect(0, 0, stageWidth, stageHeight);
            popupBackDrop.graphics.endFill();
            const glow = new createjs.Shape();
            glow.graphics.f('#ffffff').drawRoundRect(0, 0, w, h, 15, 15);
            glow.width = w;
            glow.height = h;
            glow.alpha = 0.2;
            this.addGlow(glow);
            const border = new createjs.Shape();
            border.graphics.ss(5).s('#FF6600').drawRoundRect(0, 0, w, h, 15, 15);
            border.width = w;
            border.height = h;
            this.addGlow(border, 3);
            popup.addChild(popupBack);
            popup.addChild(messageField);
            popup.addChild(glow);
            popup.addChild(border);
            popup.addChild(button);
            var popupMC = new Popup();
            popupBack.x = stageWidth / 2 - popupBack.width / 2;
            glow.x = popupBack.x;
            border.x = popupBack.x;
            popupBack.y = stageHeight / 2 - popupBack.height / 2;
            glow.y = popupBack.y;
            border.y = popupBack.y;
            if (centerText) {
                messageField.x = popupBack.x + popupBack.width / 2;
            } else {
                messageField.x = popupBack.x + (popupBack.width - messageField.lineWidth) / 2;
            }
            messageField.y = popupBack.y + 25;
            button.y = messageField.y + messageField.getMeasuredHeight() + 10;
            button.x = popupBack.x + (popupBack.width - button.width) / 2;
            popupMC.addChild(popupBackDrop);
            popupMC.addChild(popup);
            popupBackDrop.name = 'background';
            popup.name = 'popup';
            popupBackDrop.alpha = 0.5;
            myStage.addChild(popupMC);
            return popupMC;
        },
        twoChoicePopup(myStage, s, b1_text, b2_text, eName, numCharOrange=0, centerText=false, w=500) {
            var popup = new createjs.MovieClip();
            var popupBackDrop = new createjs.Shape();
            var messageField = this.createTextField(s, w - 20, numCharOrange, centerText);
            var button1 = this.createButton(b1_text, 125, 35);
            var button2 = this.createButton(b2_text, 125, 35);
            const stageWidth = myStage.canvas.clientWidth;
            const stageHeight = myStage.canvas.clientHeight;
            if (button1.width > button2.width) {
                button2 = this.createButton(b2_text, button1.width);
            } else {
                button1 = this.createButton(b1_text, button2.width);
            }
            var h = messageField.y + messageField.getMeasuredHeight() + button1.height + 45;
            var popupBack = this.createPopup(myStage, w, h);
            this.addGlow(popupBack);
            var button1Click = function(e) {
                e.currentTarget.stage.dispatchEvent(new Event(eName + '1'));
                e.currentTarget.stage.dispatchEvent(new Event(Menu.CLOSE_WINDOW));
                e.currentTarget.stage.removeChild(e.currentTarget.parent.parent);
            };
            var button2Click = function(e) {
                e.currentTarget.stage.dispatchEvent(new Event(eName + '2'));
                e.currentTarget.stage.dispatchEvent(new Event(Menu.CLOSE_WINDOW));
                e.currentTarget.stage.removeChild(e.currentTarget.parent.parent);
            };
            button1.addEventListener('click', button1Click);
            button2.addEventListener('click', button2Click);
            popupBackDrop.graphics.beginFill('#000000');
            popupBackDrop.graphics.drawRect(0, 0, stageWidth, stageHeight);
            popupBackDrop.graphics.endFill();
            const glow = new createjs.Shape();
            glow.graphics.f('#ffffff').drawRoundRect(0, 0, w, h, 15, 15);
            glow.width = w;
            glow.height = h;
            glow.alpha = 0.2;
            this.addGlow(glow);
            const border = new createjs.Shape();
            border.graphics.ss(5).s('#FF6600').drawRoundRect(0, 0, w, h, 15, 15);
            border.width = w;
            border.height = h;
            this.addGlow(border, 3);
            popup.addChild(popupBack);
            popup.addChild(messageField);
            popup.addChild(glow);
            popup.addChild(border);
            popup.addChild(button1);
            popup.addChild(button2);
            var popupMC = new Popup();
            popupBack.x = (stageWidth - popupBack.width) / 2;
            popupBack.y = (stageHeight - popupBack.height) / 2;
            glow.x = popupBack.x;
            glow.y = popupBack.y;
            border.x = popupBack.x;
            border.y = popupBack.y;
            messageField.x = popupBack.x + (popupBack.width - messageField.lineWidth) / 2;
            messageField.y = popupBack.y + 25;
            var center = popupBack.x + popupBack.width / 2;
            button1.y = messageField.y + messageField.getMeasuredHeight() + 7;
            button1.x = center - button1.width - 5;
            button2.y = button1.y;
            button2.x = center + 5;
            popupMC.addChild(popupBackDrop);
            popupMC.addChild(popup);
            popupBackDrop.name = 'background';
            popup.name = 'popup';
            popupBackDrop.alpha = 0.5;
            myStage.addChild(popupMC);
            return popupMC;
        },
        multipleChoicePopup(myStage, s, aArray, eName, numCharOrange=0, centerText=false, w=500) {
            var popup = new createjs.MovieClip();
            var popupBackDrop = new createjs.Shape();
            var messageField = this.createTextField(s, w - 10, numCharOrange, centerText);
            var bArray = [];
            var tArray = [];
            var bMC = new createjs.MovieClip();
            for (var i = 0; i < aArray.length; i++) {
                bArray[i] = this.createButton(String.fromCharCode(65 + i));
                tArray[i] = this.createTextField(aArray[i], w - bArray[i].width - 30);
                tArray[i].x = bArray[i].width + 10;
                if (i > 0) {
                    if (bArray[i - 1].height > tArray[i - 1].height) {
                        if (bArray[i].height > tArray[i].height) {
                            bArray[i].y = bArray[i - 1].y + bArray[i - 1].height + 10;
                            tArray[i].y = bArray[i].y + (bArray[i].height - tArray[i].height) / 2;
                        } else {
                            tArray[i].y = bArray[i - 1].y + bArray[i - 1].height + 10;
                            bArray[i].y = tArray[i].y + (tArray[i].height - bArray[i].height) / 2;
                        }
                    } else {
                        if (bArray[i].height > tArray[i].height) {
                            bArray[i].y = tArray[i - 1].y + tArray[i - 1].height + 10;
                            tArray[i].y = bArray[i].y + (bArray[i].height - tArray[i].height) / 2;
                        } else {
                            tArray[i].y = tArray[i - 1].y + tArray[i - 1].height + 10;
                            bArray[i].y = tArray[i].y + (tArray[i].height - bArray[i].height) / 2;
                        }
                    }
                } else {
                    if (bArray[i].height > tArray[i].height) {
                        tArray[i].y = bArray[i].y + (bArray[i].height - tArray[i].height) / 2;
                    } else {
                        bArray[i].y = tArray[i].y + (tArray[i].height - bArray[i].height) / 2;
                    }
                }
                var func = function(e) {
                    e.currentTarget.stage.dispatchEvent(new Event(eName + e.currentTarget.upState.textName));
                    e.currentTarget.stage.dispatchEvent(new Event(Menu.CLOSE_WINDOW));
                    e.currentTarget.stage.removeChild(e.currentTarget.parent.parent.parent);
                };
                bArray[i].addEventListener('click', func);
                bMC.addChild(bArray[i]);
                bMC.addChild(tArray[i]);
            }
            var popupBack = this.createPopup(myStage, w, messageField.y + messageField.getMeasuredHeight() + bMC.height + 25);
            this.addGlow(popupBack);
            popupBackDrop.graphics.beginFill('#000000');
            popupBackDrop.graphics.drawRect(0, 0, myStage.stageWidth, myStage.stageHeight);
            popupBackDrop.graphics.endFill();
            popupBack.x = (myStage.stageWidth - popupBack.width) / 2;
            popupBack.y = (myStage.stageHeight - popupBack.height) / 2;
            messageField.x = popupBack.x + (popupBack.width - messageField.lineWidth) / 2;
            messageField.y = popupBack.y + (popupBack.width - messageField.lineWidth) / 2;
            bMC.y = messageField.y + messageField.getMeasuredHeight() + 10;
            bMC.x = popupBack.x + 10;
            popup.addChild(popupBack);
            popup.addChild(messageField);
            popup.addChild(bMC);
            var popupMC = new Popup();
            popupMC.addChild(popupBackDrop);
            popupMC.addChild(popup);
            popupBackDrop.name = 'background';
            popup.name = 'popup';
            popupBackDrop.alpha = 0.5;
            myStage.addChild(popupMC);
            return popupMC;
        },
        createTextField(s, w=265, l=0, centerText=false) {
            const textAlign = centerText ? 'center' : 'left';
            var tf = new createjs.Text();
            tf.color = '#FFFFFF';
            tf.font = '16px Verdana';
            tf.lineHeight = 21;
            tf.textAlign = textAlign;
            tf.textBaseline = 'middle';
            tf.lineWidth = w;
            tf.text = s;
            return tf;
        },
        createPopup(myStage, w, h) {
            myStage.dispatchEvent(new Event('open_window'));
            var shape = new createjs.Shape();
            shape.graphics.setStrokeStyle(3).beginStroke('rbga(255,102,0,1)');
            shape.graphics.beginFill(0x333333, 1);
            shape.graphics.drawRoundRect(0, 0, w, h, 15, 15);
            shape.graphics.endFill();
            shape.width = w + 3;
            shape.height = h + 3;
            return shape;
        },
        createButton(textString, w=-1, h=35) {
            var upState = new createjs.MovieClip();
            var overState = new createjs.MovieClip();
            var downState = new createjs.MovieClip();
            upState.textName = textString;
            var stateOver = new createjs.Shape();
            var stateOverShadow = new createjs.Shape();
            var stateDown = new createjs.Shape();
            var stateDownShadow = new createjs.Shape();
            var buttonBackUp = new createjs.Shape();
            var buttonBackOver = new createjs.Shape();
            var buttonBackDown = new createjs.Shape();
            var font = '22px Montserrat';
            var color = '#FFFFFF';
            var textAlign = 'center';
            var textBaseline = 'middle';
            var buttonTextUp = new createjs.Text();
            buttonTextUp.font = font;
            buttonTextUp.color = color;
            buttonTextUp.lineWidth = w;
            buttonTextUp.textAlign = textAlign;
            buttonTextUp.textBaseline = textBaseline;
            buttonTextUp.embedFonts = true;
            buttonTextUp.autoSize = 'left';
            buttonTextUp.text = textString;
            var buttonTextOver = new createjs.Text();
            buttonTextOver.font = font;
            buttonTextOver.color = color;
            buttonTextOver.lineWidth = w;
            buttonTextOver.textAlign = textAlign;
            buttonTextUp.textBaseline = textBaseline;
            buttonTextOver.embedFonts = true;
            buttonTextOver.autoSize = 'left';
            buttonTextOver.text = textString;
            var buttonTextDown = new createjs.Text();
            buttonTextDown.font = font;
            buttonTextDown.color = color;
            buttonTextDown.lineWidth = w;
            buttonTextDown.textAlign = textAlign;
            buttonTextUp.textBaseline = textBaseline;
            buttonTextDown.embedFonts = true;
            buttonTextDown.autoSize = 'left';
            buttonTextDown.text = textString;
            var _buttonWidth = buttonTextUp.lineWidth + 12;
            var _buttonHeight = h;
            if (w !== -1) {
                _buttonWidth = w;
            }
            buttonTextUp.x = Math.ceil(_buttonWidth / 2);
            buttonTextUp.y = Math.ceil(_buttonHeight / 2);
            buttonTextOver.x = buttonTextUp.x;
            buttonTextOver.y = 4;
            buttonTextDown.x = buttonTextUp.x;
            buttonTextDown.y = 7;
            buttonBackUp.graphics.setStrokeStyle(4).beginStroke('#99999980');
            buttonBackDown.graphics.setStrokeStyle(4).beginStroke('#99999900');
            stateDown.graphics.setStrokeStyle(2).beginStroke('#99999900');
            stateDownShadow.graphics.setStrokeStyle(4).beginStroke('#99999980');
            buttonBackOver.graphics.setStrokeStyle(4).beginStroke('#99999900');
            stateOver.graphics.setStrokeStyle(2).beginStroke('#99999900');
            stateOverShadow.graphics.setStrokeStyle(4).beginStroke('#99999980');
            var x0 = 0;
            var x1 = 0;
            var y0 = 0;
            var y1 = h;
            buttonBackUp.graphics.beginLinearGradientFill(['#9D9D9D', '#717171'], [0, 1], x0, y0, x1, y1);
            buttonBackUp.graphics.drawRoundRect(0, 0, _buttonWidth, _buttonHeight, 10);
            buttonBackUp.graphics.endFill();
            buttonBackDown.graphics.beginLinearGradientFill(['#9D9D9D', '#717171'], [0, 1], x0, y0, x1, y1);
            buttonBackDown.graphics.drawRoundRect(1, 3, _buttonWidth - 1, _buttonHeight - 4, 10);
            buttonBackDown.graphics.endFill();
            stateDown.graphics.beginFill('#FF3300B2');
            stateDown.graphics.drawRoundRect(1, 3, _buttonWidth - 1, _buttonHeight - 4, 10);
            stateDown.graphics.endFill();
            stateDownShadow.graphics.beginFill('#000000');
            stateDownShadow.graphics.drawRoundRect(0, 0, _buttonWidth, _buttonHeight, 10);
            stateDownShadow.graphics.endFill();
            buttonBackOver.graphics.beginLinearGradientFill(['#9D9D9D', '#717171'], [0, 1], x0, y0, x1, y1);
            buttonBackOver.graphics.drawRoundRect(0, -2, _buttonWidth, _buttonHeight, 10);
            buttonBackOver.graphics.endFill();
            stateOver.graphics.beginFill('#FF330033');
            stateOver.graphics.drawRoundRect(0, -1, _buttonWidth, _buttonHeight - 2, 10);
            stateOver.graphics.endFill();
            stateOverShadow.graphics.beginFill('#000000');
            stateOverShadow.graphics.drawRoundRect(0, 0, _buttonWidth, _buttonHeight, 10);
            stateOverShadow.graphics.endFill();
            upState.addChild(buttonBackUp);
            upState.addChild(buttonTextUp);
            overState.addChild(buttonBackOver);
            overState.addChild(stateOver);
            overState.addChild(buttonTextOver);
            downState.addChild(buttonBackDown);
            downState.addChild(stateDown);
            downState.addChild(buttonTextDown);
            const bounds = {
                width: _buttonWidth,
                height: _buttonHeight
            };
            var button = new SimpleButton(upState,overState,downState,bounds);
            return button;
        },
    };
}
)();
