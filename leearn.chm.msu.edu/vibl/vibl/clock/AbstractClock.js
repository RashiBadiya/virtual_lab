
class AbstractClock extends createjs.Sprite{_clockData;constructor(data){super();this._clockData=data;}
startClock=()=>{this._clockData.startClock();}
resumeClock=()=>{this._clockData.resumeClock();}
stopClock=()=>{this._clockData.stopClock();}
resetClock=()=>{this._clockData.resetClock();}}