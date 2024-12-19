function Description(lib, callback) {
    const base = new lib.msuvudatvirtual_labsDescription();
    const initDone = callback;
    let interval;
    let scrollTabStart;
    let scrollTabMouseStart;
    let heightDiff;
    let maxScroll;
    let scrollBarStart;
    let scrollBarDiff;
    let descriptions_list_over;
    const lineHeight = 21;
    base.on('added', (e) => {
        base.initialize();
    }
    );
    Object.assign(this, new lib.msuvudatvirtual_labsDescription());
    base.initialize = (e) => {
        base.width = 890;
        base.height = 492;
        base.list_mask_rect = new createjs.Shape();
        base.list_mask_rect.graphics.beginFill('#000000').drawRect(0, 67, 855, 418);
        base.descriptions_list.mask = base.list_mask_rect;
        base.descriptions_list.y = base.list_mask_area.y;
        base.list_mask_area.x = base.descriptions_list.x;
        base.list_mask_area.width = base.descriptions_list.nominalBounds.width;
        base.list_mask_area.height = base.list_mask_area.nominalBounds.height;
        base.list_mask_area.alpha = 0.01;
        base.description_mask.alpha = 0;
        base.scroll_down.addEventListener('click', base.scrollDownPress);
        base.scroll_up.addEventListener('click', base.scrollUpPress);
        base.scroll_tab.addEventListener('mousedown', base.scrollTabDown);
        base.scroll_tab.addEventListener('pressmove', base.scrollTabMove);
        base.list_mask_area.addEventListener('mouseover', base.descriptionListOver);
        base.list_mask_area.addEventListener('mouseout', base.descriptionListOut);
        canvas.addEventListener('wheel', base.descriptionsListWheel);
        scrollBarStart = base.scroll_up.y + base.scroll_up.nominalBounds.height;
        scrollBarDiff = base.scroll_down.y - base.scroll_tab.nominalBounds.height - scrollBarStart;
        descriptions_list_over = false;
        base.scroll_tab.y = scrollBarStart;
        scrollTabMouseStart = -50;
        scrollTabStart = -50;
        initDone();
    }
    ;
    base.loadXML = (s) => {
        XMLLoader(s, base.initXML);
    }
    ;
    base.initXML = (xmlDoc) => {
        const descriptionChildren = xmlDoc.documentElement.children;
        let infoLabel;
        let info;
        let lastY = -1;
        let lastHeight = 0;
        for (let i = 0; i < descriptionChildren.length; i += 1) {
            infoLabel = new createjs.Text();
            infoLabel.color = '#FF6600';
            infoLabel.font = '16px Verdana';
            infoLabel.lineHeight = lineHeight;
            info = new createjs.Text();
            info.color = '#FFFFFF';
            info.font = '16px Verdana';
            info.lineHeight = lineHeight;
            const tagName = descriptionChildren[i].nodeName;
            infoLabel.text = tagName.split('_').join(' ') + ':';
            info.text = descriptionChildren[i].childNodes[0] ? descriptionChildren[i].childNodes[0].nodeValue : '';
            base.descriptions_list.addChild(infoLabel);
            base.descriptions_list.addChild(info);
            info.lineWidth = base.descriptions_list.nominalBounds.width * 0.8 - 20;
            infoLabel.lineWidth = base.descriptions_list.nominalBounds.width * 0.2;
            infoLabel.x = 10;
            info.x = infoLabel.lineWidth + 10;
            if (lastY === -1) {
                infoLabel.y = 15;
                info.y = 15;
            } else {
                infoLabel.y = 20 + lastY + lastHeight;
                info.y = infoLabel.y;
            }
            lastY = info.y;
            const bounds = info.getBounds();
            lastHeight = bounds ? bounds.height : info.lineHeight;
        }
        base.descriptions_list.height = lastY + lastHeight + 25;
        if (base.descriptions_list.height < base.list_mask_area.nominalBounds.height) {
            base.descriptions_list.height = base.list_mask_area.nominalBounds.height;
            heightDiff = 0;
            base.scroll_tab.visible = false;
        } else {
            heightDiff = (base.descriptions_list.height - base.list_mask_area.nominalBounds.height);
        }
        maxScroll = base.list_mask_area.y - heightDiff;
    }
    ;
    base.listMove = (delta) => {
        base.descriptions_list.y += delta;
        if (base.descriptions_list.y > base.list_mask_area.y) {
            base.descriptions_list.y = base.list_mask_area.y;
        } else if (base.descriptions_list.y < maxScroll) {
            base.descriptions_list.y = maxScroll;
        }
    }
    ;
    base.descriptionListOver = () => {
        descriptions_list_over = true;
    }
    ;
    base.descriptionListOut = () => {
        descriptions_list_over = false;
    }
    ;
    base.descriptionsListWheel = (e) => {
        if (!descriptions_list_over)
            return;
        base.listMove(e.wheelDelta);
        base.moveScrollbar();
    }
    ;
    base.moveScrollbar = () => {
        const percent = (base.list_mask_area.y - base.descriptions_list.y) / heightDiff;
        base.scroll_tab.y = scrollBarStart + (scrollBarDiff * percent);
    }
    ;
    base.scrollTabDown = (e) => {
        const local = stage.globalToLocal(e.stageX, e.stageY);
        scrollTabMouseStart = local.y;
        scrollTabStart = base.scroll_tab.y;
    }
    ;
    base.scrollTabMove = (e) => {
        const local = stage.globalToLocal(e.stageX, e.stageY);
        base.scroll_tab.y = scrollTabStart + (local.y - scrollTabMouseStart);
        if (base.scroll_tab.y < scrollBarStart) {
            base.scroll_tab.y = scrollBarStart;
        } else if (base.scroll_tab.y > scrollBarStart + scrollBarDiff) {
            base.scroll_tab.y = scrollBarStart + scrollBarDiff;
        }
        const percent = (base.scroll_tab.y - scrollBarStart) / scrollBarDiff;
        base.descriptions_list.y = base.list_mask_area.y - (heightDiff * percent);
    }
    ;
    base.scrollDownPress = () => {
        base.listMove(-lineHeight);
        base.moveScrollbar();
    }
    ;
    base.scrollUpPress = () => {
        base.listMove(lineHeight);
        base.moveScrollbar();
    }
    ;
    base.openWindow = (intervalTime, animationTime) => {
        clearInterval(interval);
        interval = setInterval(base.fadeInAnimation, intervalTime, intervalTime, animationTime);
    }
    ;
    base.closeWindow = (intervalTime=1, animationTime=1) => {
        clearInterval(interval);
        base.list_mask_area.removeEventListener(Event.ENTER_FRAME, base.listMove);
        interval = setInterval(base.fadeOutAnimation, intervalTime, intervalTime, animationTime);
    }
    ;
    base.fadeOutAnimation = (intervalTime, t) => {
        base.alpha -= intervalTime / t;
        if (base.alpha <= 0) {
            clearInterval(interval);
            base.visible = false;
        }
    }
    ;
    base.fadeInAnimation = (intervalTime, t) => {
        base.visible = true;
        base.alpha += intervalTime / t;
        if (base.alpha >= 1) {
            clearInterval(interval);
        }
    }
    ;
    return base;
}
