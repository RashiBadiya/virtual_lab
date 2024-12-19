function Steps(lib, callback) {
    const base = new lib.msuvudatvirtual_labsSteps();
    const initDone = callback;
    let interval;
    let currentClip;
    let listOfVideos;
    let steps_list_new_percent;
    let scrollingTimeout;
    let heightDiff;
    let scrollBarStart;
    let scrollBarDiff;
    let captionFieldOrigY;
    let captionFieldFormat;
    base.on('added', (e) => {
        base.initialize();
    }
    );
    base.initialize = (e) => {
        base.width = 890;
        base.height = 492;
        base.steps_list.mask = base.list_mask.shape;
        base.list_mask_area.alpha = 0;
        base.steps_list.y = base.list_mask_area.y;
        base.list_mask_area.x = base.steps_list.x;
        base.list_mask_area.width = base.steps_list.width;
        base.list_mask_area.height = stage.globalToLocal(0, base.list_mask_area.nominalBounds.height).y;
        base.steps_list.height = stage.globalToLocal(0, base.steps_list.nominalBounds.height).y;
        scrollingTimeout = -1;
        base.scroll_tab.on('mousedown', (e) => base.scrollTabDown(e));
        base.scroll_tab.on('click', (e) => base.scrollTabUp(e));
        base.scroll_down.on('mousedown', (e) => base.scrollDownPress(e));
        base.scroll_up.on('mousedown', (e) => base.scrollUpPress(e));
        base.steps_list.on('wheel', (e) => base.stepsListWheel(e));
        heightDiff = (base.steps_list.height - base.list_mask_area.height);
        scrollBarStart = base.scroll_up.y + base.scroll_up.nominalBounds.height;
        scrollBarDiff = base.scroll_down.y - base.scroll_tab.nominalBounds.height - scrollBarStart;
        base.scroll_tab.y = scrollBarStart;
        steps_list_new_percent = 0;
        captionFieldOrigY = base.captionField.y;
        captionFieldFormat = new createjs.Text();
        captionFieldFormat.font = '16pt Verdana';
        base.captionField.defaultTextFormat = captionFieldFormat;
        initDone();
    }
    ;
    base.loadXML = (s) => {
        XMLLoader(s, base.initXML);
    }
    ;
    base.initXML = (xmlDoc) => {
        const stepLis = xmlDoc.getElementsByTagName('step_li');
        listOfVideos = [];
        let lastY = 0;
        let numLinesTotal = 0;
        let totalHeight = 0;
        for (let i = 0; i < stepLis.length; i += 1) {
            const stepLi = stepLis[i];
            const aLabel = stepLi.getElementsByTagName('stepLabel')[0];
            const aLabelContent = aLabel ? aLabel.textContent : '';
            const aType = stepLi.getElementsByTagName('stepType')[0];
            const aTypeContent = aType ? aType.textContent : '';
            const aURL = stepLi.getElementsByTagName('stepURL')[0];
            const aURLContent = aURL ? aURL.textContent : '';
            const aCaption = stepLi.getElementsByTagName('stepCaption')[0];
            const aCaptionContent = aCaption ? aCaption.textContent : '';
            const numLines = Math.ceil(aLabelContent.length / 74);
            numLinesTotal += numLines;
            const separatorLine = new lib.stepsSeparatorLine();
            listOfVideos[i] = new Step_Li(aLabelContent,i,aTypeContent,numLines,lastY,lib);
            listOfVideos[i].setSource(aURLContent);
            listOfVideos[i].setCaption(aCaptionContent);
            base.steps_list.addChild(listOfVideos[i]);
            listOfVideos[i].y = lastY + 5;
            listOfVideos[i].addEventListener('click', base.StepLiClickThis);
            base.steps_list.background.height = numLines * 20;
            base.steps_list.addChild(separatorLine);
            separatorLine.y = listOfVideos[i].y + base.steps_list.background.height + 5;
            lastY = separatorLine.y;
        }
        if (lastY < base.list_mask_area.nominalBounds.height) {
            base.steps_list.background.height = base.list_mask_area.height;
            heightDiff = 0;
            base.scroll_tab.visible = false;
        } else {
            heightDiff = (lastY - base.list_mask_area.nominalBounds.height);
        }
        totalHeight = numLinesTotal * 21;
        if (totalHeight < base.list_mask_area.height) {
            totalHeight = base.list_mask_area.height;
            heightDiff = 0;
            base.scroll_tab.visible = false;
        } else {
            heightDiff = (totalHeight - base.list_mask_area.height);
        }
    }
    ;
    base.loadVideo = (_source, opened=false) => {
        const video = document.querySelector('#floatingVideo video');
        if (video)
            video.pause();
        const floatingVideo = document.getElementById('floatingVideo');
        if (floatingVideo)
            VideoLoader(_source, 'floatingVideo');
    }
    ;
    base.loadImage = (_source) => {
        base.captionField.height = base.captionField.y + base.captionField.height - (captionFieldOrigY);
        base.captionField.y = captionFieldOrigY;
        base.captionSB.setBounds(0, 0, base.captionSB.width, base.captionField.height);
        base.captionSB.y = base.captionField.y;
    }
    ;
    base.loadText = () => {
        base.captionField.y = 80;
    }
    ;
    base.loadNext = (e) => {
        if (listOfVideos.length > 0) {
            let nextI;
            if (currentClip === null) {
                nextI = 0;
            } else {
                nextI = currentClip.getIndex() + 1;
                if (nextI < listOfVideos.length) {
                    currentClip.setCurrent(false);
                }
            }
            if (nextI < listOfVideos.length) {
                currentClip = listOfVideos[nextI];
                currentClip.clickthis(e);
                base.loadNextItem(currentClip);
            }
        }
    }
    ;
    base.loadNextItem = (clip) => {
        if (clip.getType() === 'video') {
            base.loadVideo(clip.getClipSource());
        } else if (clip.getType() === 'image') {
            base.loadImage(clip.getClipSource());
        } else {
            base.loadText();
        }
        base.captionField.text = clip.getCaption();
        base.captionField.color = '#FF471A';
        base.captionField.font = '16px Verdana';
    }
    ;
    base.loadPrevious = (e) => {
        if (listOfVideos.length > 0) {
            let nextI;
            if (currentClip === null) {
                nextI = 0;
            } else {
                nextI = currentClip.getIndex() - 1;
                if (nextI >= 0) {
                    currentClip.setCurrent(false);
                }
            }
            if (nextI >= 0) {
                currentClip = listOfVideos[nextI];
                currentClip.clickthis(e);
                base.loadNextItem(currentClip);
            }
        }
    }
    ;
    base.StepLiClickThis = (e) => {
        if (currentClip && e.currentTarget !== currentClip) {
            currentClip.setToNormal();
        }
        currentClip = e.currentTarget;
        base.loadNextItem(currentClip);
    }
    ;
    base.stepsListWheel = (e) => {
        steps_list_new_percent = steps_list_new_percent - (e.delta / 25);
        if (steps_list_new_percent < 0) {
            steps_list_new_percent = 0;
        }
        if (steps_list_new_percent > 1) {
            steps_list_new_percent = 1;
        }
    }
    ;
    base.moveListPercent = (percent) => {
        base.steps_list.y = base.list_mask_area.y - heightDiff * percent;
        base.scroll_tab.y = scrollBarStart + scrollBarDiff * percent;
    }
    ;
    base.scrollDownPress = (e) => {
        if (base.steps_list.height > base.list_mask_area.height) {
            let percent = (base.scroll_tab.y - scrollBarStart) / scrollBarDiff + 0.02;
            if (percent > 1) {
                percent = 1;
            }
            base.moveListPercent(percent);
            steps_list_new_percent = percent;
            if (scrollingTimeout === -1) {
                scrollingTimeout = setTimeout(base.scrollDownPress, 250, e);
            } else {
                scrollingTimeout = setTimeout(base.scrollDownPress, 25, e);
            }
        }
    }
    ;
    base.scrollUpPress = (e) => {
        if (base.steps_list.height > base.list_mask_area.height) {
            let percent = (base.scroll_tab.y - scrollBarStart) / scrollBarDiff - 0.02;
            if (percent < 0) {
                percent = 0;
            }
            base.moveListPercent(percent);
            steps_list_new_percent = percent;
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
        const divVideo = document.getElementById('videoFrame');
        if (divVideo) {
            setTimeout( () => {
                divVideo.style.display = 'block';
            }
            , animationTime);
        }
    }
    ;
    base.closeWindow = (intervalTime=1, animationTime=1) => {
        const video = document.querySelector('#floatingVideo video');
        if (video)
            video.pause();
        const divVideo = document.getElementById('videoFrame');
        if (divVideo)
            divVideo.style.display = 'none';
        clearInterval(interval);
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
