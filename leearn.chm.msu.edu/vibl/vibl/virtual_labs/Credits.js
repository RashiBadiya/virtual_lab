function Credits(lib, callback) {
    const base = new lib.msuvudatvirtual_labsCredits();
    const initDone = callback;
    let interval;
    let scrollingTimeout;
    let scrollTabStart;
    let scrollTabMouseStart;
    let scrolling;
    let credits_list_new_percent;
    let heightDiff;
    let scrollBarStart;
    let scrollBarDiff;
    let upperZoneEnd;
    let lowerZoneStart;
    let lowerZoneArea;
    let credits_list_over;
    base.on('added', (e) => {
        base.initialize();
    }
    );
    base.initialize = (e) => {
        base.width = 890;
        base.height = 492;
        base.credits_list.mask = base.credits_mask;
        base.list_mask_area.alpha = 0;
        base.credits_list.y = base.list_mask_area.y;
        base.list_mask_area.x = base.credits_list.x;
        base.list_mask_area.width = base.credits_list.nominalBounds.width;
        scrollingTimeout = -1;
        base.scroll_tab.on('mousedown', (e) => base.scrollTabDown(e));
        base.scroll_tab.on('click', (e) => base.scrollTabUp(e));
        base.scroll_down.on('mousedown', (e) => base.scrollDownPress(e));
        base.scroll_up.on('mousedown', (e) => base.scrollUpPress(e));
        base.list_mask_area.on('mouseover', (e) => base.creditsListOver(e));
        base.list_mask_area.on('mouseout', (e) => base.creditsListOut(e));
        base.list_mask_area.on('wheel', (e) => base.creditsListWheel(e));
        scrollBarStart = base.scroll_up.y + base.scroll_up.nominalBounds.height;
        scrollBarDiff = base.scroll_down.y - base.scroll_tab.nominalBounds.height - scrollBarStart;
        upperZoneEnd = parseInt(base.list_mask_area.nominalBounds.height / 2, 10) - 100;
        lowerZoneStart = parseInt(base.list_mask_area.nominalBounds.height / 2, 10) + 100;
        lowerZoneArea = base.list_mask_area.nominalBounds.height - lowerZoneStart;
        credits_list_over = false;
        base.scroll_tab.y = scrollBarStart;
        scrollTabMouseStart = -50;
        scrollTabStart = -50;
        credits_list_new_percent = 0;
        initDone();
    }
    ;
    base.loadXML = (s) => {
        XMLLoader(s, base.initXML);
    }
    ;
    base.initXML = (xmlDoc) => {
        const creditsChildren = xmlDoc.documentElement.children;
        let infoLabel;
        let info;
        let lastY = -1;
        let lastHeight = 0;
        for (let i = 0; i < creditsChildren.length; i += 1) {
            infoLabel = new createjs.Text();
            infoLabel.color = '#FF6600';
            infoLabel.font = '16px Verdana';
            infoLabel.lineHeight = '24';
            info = new createjs.Text();
            info.color = '#FFFFFF';
            info.font = '16px Verdana';
            info.lineHeight = '24';
            var tagName = creditsChildren[i].nodeName;
            infoLabel.text = tagName.split('_').join(' ') + ':';
            info.text = creditsChildren[i].childNodes[0].nodeValue;
            base.credits_list.addChild(infoLabel);
            base.credits_list.addChild(info);
            info.lineWidth = base.credits_list.nominalBounds.width * 0.8 - 20;
            infoLabel.lineWidth = base.credits_list.nominalBounds.width * 0.2;
            infoLabel.x = 10;
            info.x = infoLabel.lineWidth + 10;
            if (lastY === -1) {
                infoLabel.y = 15;
                info.y = 15;
            } else {
                infoLabel.y = 10 + lastY + lastHeight;
                info.y = infoLabel.y;
            }
            lastY = info.y;
            lastHeight = info.getBounds().height;
        }
        base.credits_list.list_background.nominalBounds.height = lastY + lastHeight + 15;
        if (base.credits_list.list_background.nominalBounds.height < base.list_mask_area.nominalBounds.height) {
            base.credits_list.list_background.nominalBounds.height = base.list_mask_area.nominalBounds.height;
            heightDiff = 0;
            base.scroll_tab.visible = false;
        } else {
            heightDiff = (base.credits_list.list_background.nominalBounds.height - base.list_mask_area.nominalBounds.height);
        }
        base.credits_list.mask.alpha = 0;
    }
    ;
    base.listMove = (e) => {
        if (base.credits_list.height > base.list_mask_area.nominalBounds.height) {
            const mousex = base.list_mask_area.mouseX;
            const mousey = base.list_mask_area.mouseY;
            let percent;
            if (scrolling) {
                percent = (scrollTabStart - scrollBarStart + mousey - scrollTabMouseStart) / scrollBarDiff;
                if (percent < 0) {
                    percent = 0;
                } else if (percent > 1) {
                    percent = 1;
                }
                base.moveListPercent(percent);
                credits_list_new_percent = percent;
            } else {
                percent = (base.scroll_tab.y - scrollBarStart) / scrollBarDiff;
                if (mousex < base.list_mask_area.nominalBounds.width - 25) {
                    if (credits_list_over) {
                        if (mousey <= upperZoneEnd) {
                            credits_list_new_percent = percent - 0.5 * (upperZoneEnd - mousey) / upperZoneEnd;
                            if (credits_list_new_percent < 0) {
                                credits_list_new_percent = 0;
                            }
                        } else if (mousey >= lowerZoneStart) {
                            credits_list_new_percent = percent + 0.5 * (mousey - lowerZoneStart) / lowerZoneArea;
                            if (credits_list_new_percent > 1) {
                                credits_list_new_percent = 1;
                            }
                        }
                    }
                }
                base.moveListPercent(percent + (credits_list_new_percent - percent) / 6);
            }
        }
    }
    ;
    base.creditsListOver = (e) => {
        credits_list_over = true;
    }
    ;
    base.creditsListOut = (e) => {
        credits_list_over = false;
    }
    ;
    base.creditsListWheel = (e) => {
        credits_list_new_percent = credits_list_new_percent - (e.delta / 25);
        if (credits_list_new_percent < 0) {
            credits_list_new_percent = 0;
        }
        if (credits_list_new_percent > 1) {
            credits_list_new_percent = 1;
        }
    }
    ;
    base.moveListPercent = (percent) => {
        base.credits_list.y = base.list_mask_area.y - heightDiff * percent;
        base.scroll_tab.y = scrollBarStart + scrollBarDiff * percent;
    }
    ;
    base.scrollTabDown = (e) => {
        scrolling = true;
        scrollTabMouseStart = base.list_mask_area.mouseY;
        scrollTabStart = base.scroll_tab.y;
    }
    ;
    base.scrollTabUp = (e) => {
        scrolling = false;
        if (scrollingTimeout !== -1) {
            clearTimeout(scrollingTimeout);
            scrollingTimeout = -1;
        }
    }
    ;
    base.scrollDownPress = (e) => {
        if (base.credits_list.height > base.list_mask_area.height) {
            let percent = (base.scroll_tab.y - scrollBarStart) / scrollBarDiff + 0.02;
            if (percent > 1) {
                percent = 1;
            }
            base.moveListPercent(percent);
            credits_list_new_percent = percent;
            if (scrollingTimeout === -1) {
                scrollingTimeout = setTimeout(base.scrollDownPress, 250, e);
            } else {
                scrollingTimeout = setTimeout(base.scrollDownPress, 25, e);
            }
        }
    }
    ;
    base.scrollUpPress = (e) => {
        if (base.credits_list.height > base.list_mask_area.height) {
            let percent = (base.scroll_tab.y - scrollBarStart) / scrollBarDiff - 0.02;
            if (percent < 0) {
                percent = 0;
            }
            base.moveListPercent(percent);
            credits_list_new_percent = percent;
            if (scrollingTimeout === -1) {
                scrollingTimeout = setTimeout(base.scrollUpPress, 250, e);
            } else {
                scrollingTimeout = setTimeout(base.scrollUpPress, 25, e);
            }
        }
    }
    ;
    base.openWindow = (intervalTime, animationTime) => {
        clearInterval(interval);
        interval = setInterval(base.fadeInAnimation, intervalTime, intervalTime, animationTime);
    }
    ;
    base.closeWindow = (intervalTime=1, animationTime=1) => {
        clearInterval(interval);
        base.list_mask_area.removeEventListener('mouseover', base.listMove);
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
            base.list_mask_area.addEventListener('mouseover', base.listMove);
            clearInterval(interval);
        }
    }
    ;
    return base;
}
