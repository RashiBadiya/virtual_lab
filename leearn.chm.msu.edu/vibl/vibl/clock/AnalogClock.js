function AnalogClock(lib, data) {
    const base = new lib.msuvudatcomponentsclockAnalogClock();
    base.prototype = new AbstractClock(data);
    const HOUR_ROTATION_TICK = 30;
    const MINUTE_ROTATION_TICK = 6;
    const _clockData = data;
    base.on('added', (e) => {
        initialization();
    }
    );
    const initialization = () => {
        base.hour_hand.x = base.body.getBounds().width / 2;
        base.hour_hand.y = base.body.getBounds().height / 2;
        base.minute_hand.x = base.body.getBounds().width / 2;
        base.minute_hand.y = base.body.getBounds().height / 2;
        base.second_hand.x = base.body.getBounds().width / 2;
        base.second_hand.y = base.body.getBounds().height / 2;
        _clockData.addEventListener('change', base.timeChange);
    }
    ;
    base.timeChange = (e=null) => {
        var ct = _clockData.getCurrentTime();
        var hourPer = (ct.getHours() / 12);
        var minutesPer = (ct.getMinutes() / 60);
        var secondsPer = (ct.getSeconds() / 60);
        var hours = ((360 * hourPer) + (HOUR_ROTATION_TICK * minutesPer));
        var minutes = ((360 * minutesPer) + (MINUTE_ROTATION_TICK * secondsPer));
        base.hour_hand.rotation = hours;
        base.minute_hand.rotation = minutes;
        base.second_hand.rotation = 360 * (ct.getSeconds() / 60);
    }
    ;
    base.startClock = () => {
        base.prototype.startClock();
    }
    ;
    base.stopClock = () => {
        base.prototype.stopClock();
    }
    ;
    base.resetClock = () => {
        base.prototype.resetClock();
    }
    ;
    return base;
}
