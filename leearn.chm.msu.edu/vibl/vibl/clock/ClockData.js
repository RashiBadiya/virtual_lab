class ClockData extends createjs.EventDispatcher {
    _timer;
    _startTime;
    _endTime;
    _currentTime;
    _speed;
    _direction;
    _secondInc;
    getStartTime = () => {
        return this._startTime;
    }
    setStartTime = (st) => {
        this._startTime = st;
    }
    getEndTime = () => {
        return this._endTime;
    }
    setEndTime = (et) => {
        this._endTime = et;
    }
    getCurrentTime = () => {
        return this._currentTime;
    }
    getSpeed = () => {
        return this._speed;
    }
    setSpeed = (clockSpeed) => {
        if (clockSpeed > 0) {
            this._speed = clockSpeed;
        } else {
            this._speed = 1;
        }
    }
    getSecondIncrement = () => {
        return this._secondInc;
    }
    setSecondIncrement = (secondInc) => {
        if (secondInc > 0) {
            this._secondInc = secondInc;
        } else {
            this._secondInc = 1;
        }
    }
    getDirection = () => {
        return this._direction;
    }
    setDirection = (dir) => {
        if (dir === ClockDirection.FORWARD || dir === ClockDirection.BACKWARD) {
            this._direction = dir;
        } else {
            this._direction = ClockDirection.FORWARD;
        }
    }
    constructor(startTime, endTime=null, clockSpeed=50, secondInc=1, clockDirection=null) {
        super();
        this._timer = new SimpleTimer(1,this.onTimerHandler,1000 / clockSpeed);
        this._startTime = startTime;
        this._endTime = endTime;
        this._currentTime = this._startTime;
        this.setSpeed(clockSpeed);
        this.setSecondIncrement(secondInc);
        this.setDirection(clockDirection);
    }
    startClock = () => {
        this._timer.start();
    }
    resumeClock = () => {
        this._timer.resume();
    }
    stopClock = () => {
        this._timer.stop();
    }
    resetClock = () => {
        this._currentTime = this._startTime;
        this.dispatchEvent(new Event('change'));
    }
    onTimerHandler = (e) => {
        var secondOffset;
        if (this._direction === ClockDirection.FORWARD) {
            secondOffset = this._secondInc;
        } else if (this._direction === ClockDirection.BACKWARD) {
            secondOffset = -this._secondInc;
        }
        this._currentTime.setSeconds(this._currentTime.getSeconds() + secondOffset);
        this.dispatchEvent(new Event('change'));
        if (this._endTime !== null) {
            var allDone = false;
            if (this._direction === ClockDirection.FORWARD) {
                if (this._currentTime.getDate() === this._endTime.getDate() && this._currentTime.getHours() >= this._endTime.getHours() && this._currentTime.getMinutes() >= this._endTime.getMinutes() && this._currentTime.getSeconds() >= this._endTime.getSeconds()) {
                    allDone = true;
                }
            } else if (this._direction === ClockDirection.BACKWARD) {
                if (this._currentTime.getDate() === this._endTime.getDate() && this._currentTime.getHours() <= this._endTime.getHours() && this._currentTime.getMinutes() <= this._endTime.getMinutes() && this._currentTime.getSeconds() <= this._endTime.getSeconds()) {
                    allDone = true;
                }
            }
            if (allDone) {
                this._timer.stop();
                this.dispatchEvent(new Event('complete'));
            }
        }
    }
}
class SimpleTimer {
    delay;
    handler;
    interval;
    milliseconds;
    running;
    constructor(delay, handler, millisec) {
        this.delay = delay;
        this.handler = handler;
        this.milliseconds = millisec || 20;
        this.running = false;
    }
    start = () => {
        this.running = true;
        setTimeout(this.tick, this.delay);
    }
    resume = () => {
        this.running = true;
        this.tick();
    }
    stop = () => {
        this.running = false;
    }
    ticked = () => {
        if (!this.running)
            return;
        this.handler();
        this.tick();
    }
    tick = () => {
        setTimeout(this.ticked, this.milliseconds);
    }
}
