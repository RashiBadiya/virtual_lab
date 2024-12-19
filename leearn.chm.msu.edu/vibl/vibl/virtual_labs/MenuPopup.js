function MenuPopup(lib, callback) {
    const base = new lib.msuvudatvirtual_labsMenuPopup();
    const initDone = callback;
    let interval;
    let StepsMC;
    let DescriptionMC;
    let CreditsMC;
    let activeMenu;
    let intervalTime;
    let animationTime;
    let description_button;
    let steps_button;
    let credits_button;
    let start_button;
    let restart_button;
    let overlay;
    base.on('added', (e) => {
        base.initialize();
    }
    );
    base.initialize = (e) => {
        base.removeEventListener('added', base.initialize);
        base.height = base.getBounds().height;
        base.width = base.getBounds().width;
        base.x = (stage.canvas.clientWidth - base.width) / 2;
        const btnWidth = 250;
        const btnHeight = 35;
        description_button = Virtual_Labs.createButton('Description', btnWidth, btnHeight);
        steps_button = Virtual_Labs.createButton('Steps', btnWidth, btnHeight);
        credits_button = Virtual_Labs.createButton('Credits', btnWidth, btnHeight);
        start_button = Virtual_Labs.createButton('Start', btnWidth, btnHeight);
        restart_button = Virtual_Labs.createButton('Restart', btnWidth, btnHeight);
        restart_button.visible = false;
        base.close_btn.visible = false;
        description_button.x = (base.width - btnWidth) / 2 - 2;
        steps_button.x = description_button.x;
        credits_button.x = description_button.x;
        start_button.x = description_button.x;
        restart_button.x = description_button.x;
        description_button.y = 155;
        steps_button.y = description_button.y + btnHeight + 9;
        credits_button.y = steps_button.y + btnHeight + 9;
        start_button.y = credits_button.y + btnHeight + 79;
        restart_button.y = start_button.y;
        base.addChild(description_button);
        base.addChild(steps_button);
        base.addChild(credits_button);
        base.addChild(start_button);
        base.addChild(restart_button);
        const stepsInitDone = () => {
            StepsMC.x = (stage.canvas.clientWidth - StepsMC.nominalBounds.width) / 2 - base.x;
            StepsMC.y = 0;
            StepsMC.visible = false;
            StepsMC.closeWindow();
        }
        ;
        StepsMC = new Steps(lib,stepsInitDone);
        base.addChild(StepsMC);
        const descriptionInitDone = () => {
            DescriptionMC.x = (stage.canvas.clientWidth - DescriptionMC.nominalBounds.width) / 2 - base.x;
            DescriptionMC.y = 0;
            DescriptionMC.visible = false;
            DescriptionMC.closeWindow();
        }
        ;
        DescriptionMC = new Description(lib,descriptionInitDone);
        base.addChild(DescriptionMC);
        const creditsInitDone = () => {
            CreditsMC.x = (stage.canvas.clientWidth - CreditsMC.nominalBounds.width) / 2 - base.x;
            CreditsMC.y = 0;
            CreditsMC.visible = false;
            CreditsMC.closeWindow();
        }
        ;
        CreditsMC = new Credits(lib,creditsInitDone);
        base.addChild(CreditsMC);
        overlay = new createjs.Shape();
        base.redrawBackground();
        base.parent.backDrop = new createjs.MovieClip();
        base.parent.backDrop.addChild(overlay);
        const popupIndex = base.parent.getChildIndex(base);
        base.parent.addChildAt(base.parent.backDrop, popupIndex);
        description_button.addEventListener('click', menuDescriptionClick);
        steps_button.addEventListener('click', menuStepsClick);
        credits_button.addEventListener('click', menuCreditsClick);
        start_button.addEventListener('click', startClick);
        restart_button.addEventListener('click', restartClick);
        StepsMC.close_btn.on('click', (e) => closeSteps(e));
        CreditsMC.close_btn.on('click', (e) => closeCredits(e));
        DescriptionMC.close_btn.on('click', (e) => closeDescription(e));
        base.close_btn.on('click', (e) => base.openMenu());
        setActiveMenu();
        intervalTime = 1000 / stage.frameRate;
        animationTime = 250;
        initDone();
    }
    ;
    base.redrawBackground = () => {
        overlay.graphics.clear();
        overlay.graphics.beginFill('#00000080');
        overlay.graphics.drawRect(0, 0, stage.canvas.clientWidth, stage.canvas.clientHeight);
        overlay.graphics.endFill();
    }
    ;
    base.loadStepsXML = (s) => {
        StepsMC.loadXML(s);
    }
    ;
    base.loadDescriptionXML = (s) => {
        DescriptionMC.loadXML(s);
    }
    ;
    base.loadCreditsXML = (s) => {
        CreditsMC.loadXML(s);
    }
    ;
    base.disableStepsButton = () => {
        steps_button.removeEventListener('click', menuStepsClick);
        steps_button.enabled = false;
    }
    ;
    base.disableDescriptionButton = () => {
        description_button.removeEventListener('click', menuDescriptionClick);
        description_button.enabled = false;
    }
    ;
    base.disableCreditsButton = () => {
        credits_button.removeEventListener('click', menuCreditsClick);
        credits_button.enabled = false;
    }
    ;
    const disableStartButton = () => {
        start_button.removeEventListener('click', startClick);
        start_button.enabled = false;
    }
    ;
    const disableRestartButton = () => {
        restart_button.removeEventListener('click', restartClick);
        restart_button.enabled = false;
    }
    ;
    base.enableStepsButton = () => {
        steps_button.addEventListener('click', menuStepsClick);
        steps_button.enabled = true;
    }
    ;
    base.enableDescriptionButton = () => {
        description_button.addEventListener('click', menuDescriptionClick);
        description_button.enabled = true;
    }
    ;
    base.enableCreditsButton = () => {
        credits_button.addEventListener('click', menuCreditsClick);
        credits_button.enabled = true;
    }
    ;
    const enableStartButton = () => {
        start_button.addEventListener('click', startClick);
        start_button.enabled = true;
    }
    ;
    const enableRestartButton = () => {
        restart_button.addEventListener('click', restartClick);
        restart_button.enabled = true;
    }
    ;
    base.openMenu = (openOnly=false) => {
        clearInterval(interval);
        if (base.alpha > 0 && !openOnly) {
            if (activeMenu != null) {
                base.visible = true;
                activeMenu.closeWindow(intervalTime, animationTime);
                setActiveMenu();
                overlay.visible = true;
                stage.dispatchEvent(new Event(Menu.OPEN_WINDOW));
            } else {
                interval = setInterval(fadeOutAnimation, intervalTime, intervalTime, animationTime);
                overlay.visible = false;
                stage.dispatchEvent(new Event(Menu.CLOSE_WINDOW));
            }
        } else if (base.alpha < 1) {
            interval = setInterval(fadeInAnimation, intervalTime, intervalTime, animationTime);
            overlay.visible = true;
            stage.dispatchEvent(new Event(Menu.OPEN_WINDOW));
        }
    }
    ;
    const menuDescriptionClick = (e) => {
        setActiveMenu(DescriptionMC);
        DescriptionMC.openWindow(intervalTime, animationTime);
    }
    ;
    const closeDescription = (event) => {
        setActiveMenu();
        DescriptionMC.closeWindow(intervalTime, animationTime);
    }
    ;
    const menuStepsClick = (event) => {
        setActiveMenu(StepsMC);
        StepsMC.openWindow(intervalTime, animationTime);
    }
    ;
    const closeSteps = (event) => {
        setActiveMenu();
        StepsMC.closeWindow(intervalTime, animationTime);
    }
    ;
    const menuCreditsClick = (event) => {
        setActiveMenu(CreditsMC);
        CreditsMC.openWindow(intervalTime, animationTime);
    }
    ;
    const closeCredits = (event) => {
        setActiveMenu();
        CreditsMC.closeWindow(intervalTime, animationTime);
    }
    ;
    const startClick = (event) => {
        closeWindow(intervalTime, animationTime, changeStartState);
        stage.dispatchEvent(new Event(Menu.START));
    }
    ;
    const restartClick = (event) => {
        closeWindow(intervalTime, animationTime);
        stage.dispatchEvent(new Event(Menu.RESTART));
    }
    ;
    const changeStartState = () => {
        setTimeout(doChangeStartState, 100);
    }
    ;
    const doChangeStartState = () => {
        restart_button.visible = true;
        start_button.visible = false;
        base.close_btn.visible = true;
    }
    ;
    const closeWindow = (intervalTime=1, animationTime=1, func=null) => {
        clearInterval(interval);
        interval = setInterval(fadeOutAnimation, intervalTime, intervalTime, animationTime, func);
        overlay.visible = false;
    }
    ;
    const fadeOutAnimation = (intervalTime, t, func=null) => {
        base.alpha -= intervalTime / t;
        if (base.alpha <= 0) {
            clearInterval(interval);
            base.visible = false;
            if (func != null) {
                func();
            }
        }
    }
    ;
    const fadeInAnimation = (intervalTime, t) => {
        base.visible = true;
        base.alpha += intervalTime / t;
        if (base.alpha >= 1) {
            clearInterval(interval);
        }
    }
    ;
    const setActiveMenu = (newMenuPopup) => {
        activeMenu = newMenuPopup || null;
        if (activeMenu) {
            base.disableStepsButton();
            base.disableDescriptionButton();
            base.disableCreditsButton();
            disableStartButton();
            disableRestartButton();
        } else {
            base.enableStepsButton();
            base.enableDescriptionButton();
            base.enableCreditsButton();
            enableStartButton();
            enableRestartButton();
        }
    }
    ;
    return base;
}
