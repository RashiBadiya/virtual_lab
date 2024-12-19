function DigitalClock(lib, data, timeFormat='HH:MM:SS') {
    const base = new lib.msuvudatcomponentsclockDigitalClock();
    base.prototype = new AbstractClock(data);
    const _clockData = data;
    const _timeFormat = timeFormat;
    base.on('added', (e) => {
        init(lib);
    }
    );
    const init = (lib) => {
        var digit;
        for (let i = 0; i < _timeFormat.length; i += 1) {
            digit = new DigitalClockDigit(lib);
            digit.name = 'digit_' + i;
            digit.x = Math.round(digit.nominalBounds.width * i);
            digit.y = 0;
            base.addChild(digit);
        }
        _clockData.addEventListener('change', base.timeChange);
        base.timeChange();
    }
    ;
    base.timeChange = (e=null) => {
        var ct = _clockData.getCurrentTime();
        var formattedTime = _timeFormat;
        var hours = String(ct.getHours()).length === 1 ? '0' + String(ct.getHours()) : String(ct.getHours());
        var minutes = String(ct.getMinutes()).length === 1 ? '0' + String(ct.getMinutes()) : String(ct.getMinutes());
        var seconds = String(ct.getSeconds()).length === 1 ? '0' + String(ct.getSeconds()) : String(ct.getSeconds());
        formattedTime = formattedTime.replace(/HH/, hours);
        formattedTime = formattedTime.replace(/MM/, minutes);
        formattedTime = formattedTime.replace(/SS/, seconds);
        var digit_sp;
        for (let i = 0; i < formattedTime.length; i += 1) {
            digit_sp = base.getChildByName('digit_' + i);
            digit_sp.setDigit((formattedTime.charAt(i)));
        }
    }
    ;
    base.startClock = () => {
        base.prototype.startClock();
    }
    ;
    base.resumeClock = () => {
        _clockData.addEventListener('change', base.timeChange);
        base.prototype.resumeClock();
    }
    ;
    base.stopClock = () => {
        base.prototype.stopClock();
        _clockData.removeEventListener('change', base.timeChange);
    }
    ;
    return base;
}
