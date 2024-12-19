function Menu(library, callback) {
    const initDone = callback;
    let menuPopup = {};
    let menuButton = {};
    Menu.START = 'start';
    Menu.RESTART = 'restart';
    Menu.OPEN_WINDOW = 'open_window';
    Menu.CLOSE_WINDOW = 'close_window';
    Menu.OPEN_MENU = 'open_menu';
    Menu.MENU_BUTTON_OVER = 'menu_button_over';
    Menu.MENU_BUTTON_OUT = 'menu_button_out';
    this.on('added', (e) => {
        initialize();
    }
    );
    const initialize = (e) => {
        menuButton = Virtual_Labs.createButton('Menu', 120, 35);
        menuButton.y = 10;
        menuButton.x = stage.canvas.clientWidth - 5 - menuButton.width;
        const menuPopupInitDone = () => {
            menuPopup.parent = stage;
            menuPopup.y = menuButton.y + menuButton.height + 8;
            menuButton.addEventListener('click', this.menuEventHandler);
            menuButton.addEventListener('mouseover', this.menuEventHandler);
            menuButton.addEventListener('mouseout', this.menuEventHandler);
            stage.addEventListener(Menu.OPEN_MENU, this.openMenuEvent);
            stage.addChild(menuButton);
            menuPopup.openMenu(true);
            initDone();
        }
        ;
        menuPopup = new MenuPopup(library,menuPopupInitDone);
        stage.addChild(menuPopup);
    }
    ;
    this.loadStepsXML = (s) => {
        menuPopup.loadStepsXML(s);
    }
    ;
    this.loadDescriptionXML = (s) => {
        menuPopup.loadDescriptionXML(s);
    }
    ;
    this.loadCreditsXML = (s) => {
        menuPopup.loadCreditsXML(s);
    }
    ;
    this.disableStepsButton = () => {
        menuPopup.disableStepsButton();
    }
    ;
    this.disableDescriptionButton = () => {
        menuPopup.disableDescriptionButton();
    }
    ;
    this.disableCreditsButton = () => {
        menuPopup.disableCreditsButton();
    }
    ;
    this.menuEventHandler = (e) => {
        if (e.type === 'mouseover') {
            stage.dispatchEvent(new Event(Menu.MENU_BUTTON_OVER));
        } else if (e.type === 'mouseout') {
            stage.dispatchEvent(new Event(Menu.MENU_BUTTON_OUT));
        } else if (e.type === 'click') {
            menuPopup.openMenu();
        }
    }
    ;
    this.isVisible = () => {
        return menuPopup.visible;
    }
    ;
    this.openMenuEvent = (e) => {
        menuPopup.openMenu(true);
    }
    ;
    this.setMenuButtonPos = (x, y) => {
        menuButton.x = x;
        menuButton.y = y;
    }
    ;
    this.setMenuPopupPos = (x, y) => {
        menuPopup.x = x;
        menuPopup.y = y;
    }
    ;
    this.disableMenuButton = () => {
        menuButton.enabled = false;
        menuButton.mouseEnabled = false;
    }
    ;
    this.enableMenuButton = () => {
        menuButton.enabled = true;
        menuButton.mouseEnabled = true;
    }
    ;
}
Menu.prototype = new createjs.MovieClip();
