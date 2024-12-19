function ToolPresentationEngine(container, tool, objectMask, useCrossHair=true, animateToMouse=false, waitTrayOpened=false) {
    const _container = container;
    const _tool_symbol = tool;
    const _object_mask = objectMask;
    const _useCrossHair = useCrossHair;
    const _animateToMouse = animateToMouse;
    let _asset_container;
    let _cross_hair;
    let _tool_shadow_bmpd;
    let _tool_shadow_bmp;
    const _object_mask_x = _object_mask.x;
    const _object_mask_y = _object_mask.y;
    const _minAngle = -15;
    const _maxAngle = 20;
    let _drag;
    let _currentStyle;
    let _toolHoverStyle = {
        toolOffset: new createjs.Point(4,-8),
        shadowOffset: new createjs.Point(8,0),
        shadowBlur: 11,
        toolScale: 1,
    };
    let _toolDownStyle = {
        toolOffset: new createjs.Point(0,0),
        shadowOffset: new createjs.Point(4,3),
        shadowBlur: 5,
        toolScale: 0.95,
    };
    let _engineActive;
    let mouseX;
    let mouseY;
    const initalization = () => {
        _tool_symbol.mouseEnabled = false;
        _toolHoverStyle.toolScale = _tool_symbol.scaleX;
        _toolDownStyle.toolScale = _tool_symbol.scaleX * 0.95;
        _engineActive = true;
        _drag = true;
        _asset_container = new createjs.Container();
        _asset_container.mouseEnabled = false;
        _asset_container.mouseChildren = false;
        _asset_container.x = _tool_symbol.x;
        _asset_container.y = _tool_symbol.y;
        container.addChildAt(_asset_container, container.getChildIndex(_tool_symbol));
        createShadow(_tool_symbol);
        _tool_symbol.rotation = 0;
        if (_useCrossHair) {
            _cross_hair = new createjs.Shape();
            _cross_hair.graphics.setStrokeStyle(1).beginStroke('#000000');
            _cross_hair.graphics.moveTo(-6, 0);
            _cross_hair.graphics.lineTo(6, 0);
            _cross_hair.graphics.moveTo(0, -6);
            _cross_hair.graphics.lineTo(0, 6);
            _asset_container.addChild(_cross_hair);
        }
        this.showTool();
        _currentStyle = _toolHoverStyle;
        if (_animateToMouse) {} else {
            renderTool(new createjs.Point(_tool_symbol.x,_tool_symbol.y));
            addListeners();
        }
    }
    ;
    this.showTool = () => {
        _asset_container.visible = true;
        _tool_symbol.visible = true;
        this.setDrag(true);
    }
    ;
    this.hideTool = () => {
        _asset_container.visible = false;
        _tool_symbol.visible = false;
        this.setDrag(false);
    }
    ;
    this.getDrag = () => {
        return _drag;
    }
    ;
    this.setDrag = (b) => {
        _drag = b;
        if (_drag) {
            _container.stage.addEventListener('stagemousemove', mouseMoveHandler);
            _container.stage.addEventListener('stagemousemove', shadowHandler);
        } else {
            if (_container.stage.hasEventListener('tick')) {
                syncToMouseComplete();
            }
            _container.stage.removeEventListener('stagemousemove', mouseMoveHandler);
            _container.stage.removeEventListener('stagemousemove', shadowHandler);
        }
    }
    ;
    this.syncToMouse = () => {
        if (_container.stage.hasEventListener('stagemousemove')) {
            removeListeners();
        }
    }
    ;
    this.dispose = () => {
        if (_tool_shadow_bmpd) {
            _tool_shadow_bmpd.dispose();
        }
        if (_cross_hair) {
            if (_asset_container.contains(_cross_hair)) {
                _asset_container.removeChild(_cross_hair);
            }
        }
        if (_tool_shadow_bmp) {
            if (_asset_container.contains(_tool_shadow_bmp)) {
                _asset_container.removeChild(_tool_shadow_bmp);
            }
        }
        if (_asset_container) {
            if (_container.contains(_asset_container)) {
                _container.removeChild(_asset_container);
            }
        }
        _engineActive = false;
        removeListeners();
        _object_mask.x = _object_mask_x;
        _object_mask.y = _object_mask_y;
    }
    ;
    const addListeners = () => {
        if (_engineActive) {
            _container.stage.addEventListener('stagemousemove', mouseMoveHandler);
            _container.stage.addEventListener('mousedown', mouseButtonHandler);
            _container.stage.addEventListener('click', mouseButtonHandler);
        }
    }
    ;
    const removeListeners = () => {
        if (!_container || !_container.stage)
            return;
        _container.stage.removeEventListener('tick', syncToMouseAnimator);
        _container.stage.removeEventListener('stagemousemove', mouseMoveHandler);
        _container.stage.removeEventListener('mousedown', mouseButtonHandler);
        _container.stage.removeEventListener('click', mouseButtonHandler);
    }
    ;
    const syncToMouseAnimator = (e) => {
        var xDiff = 1;
        var yDiff = 1;
        if (Math.abs(xDiff) < 2 && Math.abs(yDiff) < 2) {
            syncToMouseComplete(e.currentTarget.mouseX, e.currentTarget.mouseY);
        } else {
            renderTool(new createjs.Point(e.currentTarget.mouseX + xDiff,e.currentTarget.mouseY + yDiff));
        }
    }
    ;
    const syncToMouseComplete = (mouseX, mouseY) => {
        _container.stage.removeEventListener('tick', syncToMouseAnimator);
        renderTool(new createjs.Point(mouseX,mouseY));
        addListeners();
    }
    ;
    const mouseMoveHandler = (e) => {
        renderTool(new createjs.Point(e.stageX,e.stageY));
    }
    ;
    const mouseButtonHandler = (e) => {
        if (e.type === 'mousedown') {
            _currentStyle = _toolDownStyle;
            renderTool(new createjs.Point(e.stageX,e.stageY));
        } else if (e.type === 'click') {
            _currentStyle = _toolHoverStyle;
        }
        _tool_symbol.scaleX = _currentStyle.toolScale;
        _tool_symbol.scaleY = _currentStyle.toolScale;
    }
    ;
    const renderTool = (p) => {
        const local = _container.globalToLocal(p.x, p.y);
        mouseX = local.x;
        mouseY = local.y;
        var heightPercentage = mouseY / stage.getBounds().height;
        var rot = _minAngle + (Math.abs(_minAngle - _maxAngle) * heightPercentage);
        _tool_symbol.x = mouseX + _currentStyle.toolOffset.x;
        _tool_symbol.y = mouseY + _currentStyle.toolOffset.y;
        _tool_symbol.rotation = rot;
        _asset_container.x = mouseX;
        _asset_container.y = mouseY;
    }
    ;
    const createShadow = (source) => {
        _tool_shadow_bmp = _tool_symbol.clone();
        const cf = new createjs.ColorFilter(0,0,0,0.15,0,0,0,);
        const blurFilter = new createjs.BlurFilter(50,15,1);
        _tool_shadow_bmp.filters = [cf, blurFilter];
        const b = _tool_shadow_bmp.nominalBounds;
        _tool_shadow_bmp.cache(-10, -10, b.width + 20, b.height + 20);
        _tool_shadow_bmp.scaleX = _toolHoverStyle.toolScale * 0.8;
        _tool_shadow_bmp.scaleY = _toolHoverStyle.toolScale * 0.8;
        _tool_shadow_bmp.mask = _object_mask;
        _asset_container.addChild(_tool_shadow_bmp);
        if (waitTrayOpened) {
            _tool_shadow_bmp.alpha = 0;
            stage.addEventListener('tray_opened', showShadow);
        } else {
            showShadow();
        }
    }
    ;
    const shadowHandler = (e) => {
        const local = _container.globalToLocal(e.stageX, e.stageY);
        _object_mask.x = _object_mask_x - local.x;
        _object_mask.y = _object_mask_y - local.y;
        var heightPercentage = mouseY / stage.getBounds().height;
        var rot = _minAngle + (Math.abs(_minAngle - _maxAngle) * heightPercentage);
        _tool_shadow_bmp.x = _currentStyle.shadowOffset.x;
        _tool_shadow_bmp.y = _currentStyle.shadowOffset.y;
        _tool_shadow_bmp.rotation = rot + 10 + (25 * heightPercentage);
    }
    ;
    const showShadow = (e) => {
        stage.removeEventListener('tray_opened', showShadow);
        _tool_shadow_bmp.alpha = 1;
    }
    ;
    initalization();
}
