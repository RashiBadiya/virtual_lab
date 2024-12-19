function Step_Li(_title, index, _stepType, numLines, yPos, lib) {
    const li = new lib.msuvudatvirtual_labsStep_Li();
    let sourceURL;
    let i = index;
    li.origStepsY;
    li.max;
    let stepType;
    let caption;
    const colorNormal = '#CCCCCC';
    const colorHover = '#FFFFFF';
    const colorSelected = '#FF6600';
    stepType = _stepType;
    if (stepType === undefined) {
        stepType = 'video';
    }
    li.buttonMode = true;
    li.title_box.color = colorNormal;
    li.title_box.font = '16px Verdana';
    li.title_box.text = _title;
    li.mouseChildren = false;
    li.cursor = 'pointer';
    li.title_box.height = numLines * 21;
    const hit = new createjs.Shape();
    hit.graphics.beginFill('#000').drawRect(0, 0, li.title_box.getMeasuredWidth(), li.title_box.getMeasuredHeight());
    li.title_box.hitArea = hit;
    li.setSource = (_source) => {
        sourceURL = _source;
    }
    ;
    li.setCaption = (_caption) => {
        caption = _caption;
    }
    ;
    li.getType = () => {
        return stepType;
    }
    ;
    li.getCaption = () => {
        return caption;
    }
    ;
    li.getClipSource = () => {
        return sourceURL;
    }
    ;
    li.getIndex = () => {
        return i;
    }
    ;
    li.setToNormal = () => {
        li.title_box.color = colorNormal;
    }
    ;
    const mouseover = (e) => {
        if (li.getType() !== 'video' && li.getCaption() === '') {
            li.cursor = 'default';
            return;
        }
        if (e.currentTarget.title_box.color !== colorSelected) {
            li.title_box.color = colorHover;
        }
    }
    ;
    const mouseup = (e) => {
        if (li.getType() !== 'video' && li.getCaption() === '')
            return;
        if (e.currentTarget.title_box.color !== colorSelected) {
            li.title_box.color = colorSelected;
        }
    }
    ;
    const mouseout = (e) => {
        if (e.currentTarget.title_box.color !== colorSelected) {
            li.title_box.color = colorNormal;
        }
    }
    ;
    li.on('click', mouseup);
    li.on('mouseover', mouseover);
    li.on('mouseout', mouseout);
    return li;
}
