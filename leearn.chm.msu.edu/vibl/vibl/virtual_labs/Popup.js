
class Popup extends createjs.MovieClip{constructor(){super();}
move(x,y){this.getChildByName('popup').x=x;this.getChildByName('popup').y=y;}
bgAlpha(a){this.getChildByName('background').alpha=a;}}