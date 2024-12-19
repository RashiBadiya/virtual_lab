/* globals
  createjs: false
*/

function XMLLoader(urlString, func) { // eslint-disable-line no-unused-vars

    const loadDoc = function(url, callback) {
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          callback(this.responseXML);
        }
      };
      xhttp.open('GET', url, true);
      xhttp.send();
    };
  
    loadDoc(urlString, func);
  }
  
  function VideoLoader(urlString, videoDivId) { // eslint-disable-line no-unused-vars
    const queue = new createjs.LoadQueue(true);
    const divVideo = document.getElementById(videoDivId);
    let videosTarget = null;
  
    queue.on('fileload', (event) => {
      videosTarget = event.result;
    });
  
    queue.loadFile({
      src: urlString,
      type: createjs.Types.BINARY,
    });
  
    queue.load();
  
    queue.on('complete', () => {
      const blob = new Blob([ videosTarget ], { type: 'video/mp4' });
      const urlCreator = window.URL || window.webkitURL;
      const objUrl = urlCreator.createObjectURL(blob);
  
      divVideo.innerHTML = `
        <video controls autoplay>
          <source type="video/mp4" src="${objUrl}" />
        </video>`;
    });
  
    queue.on('progress', (evt) => {
      const p = queue.progress * 100;
      divVideo.innerHTML = `loading... ${Math.round(p)} %`;
    });
  }
  
  function SimpleButton(_upState, _overState, _downState, bounds) { // eslint-disable-line
  
    const upState = _upState;
    const overState = _overState;
    const downState = _downState;
  
    // create button container
    const button = new createjs.Container();
    button.name = 'Simple Button';
    button.width = bounds.width;
    button.height = bounds.height;
    button.enabled = true;
  
    // add button states to this button
    button.addChild(upState);
    upState.visible = true; // show in default
  
    button.addChild(overState);
    overState.visible = false; // hide in default
  
    button.addChild(downState);
    downState.visible = false; // hide in default
  
    // mouse events
    const handleMouseOver = () => {
      if (button.enabled) {
        button.cursor = 'pointer';
      } else {
        button.cursor = 'default';
        return;
      }
      upState.visible = false;
      downState.visible = false;
      overState.visible = true;
    };
  
    const handleMouseOut = () => {
      upState.visible = true;
      overState.visible = false;
      downState.visible = false;
    };
  
    const handleMouseDown = () => {
      downState.visible = true;
      upState.visible = false;
      overState.visible = false;
    };
  
    const handleMouseUp = (e) => {
      if (!button.enabled) return;
  
      setTimeout(() => {
        upState.visible = false;
        downState.visible = false;
        overState.visible = true;
      }, 100);
      handleMouseDown();
    };
  
    button.addEventListener('click', handleMouseUp);
    button.addEventListener('mouseover', handleMouseOver);
    button.addEventListener('mouseout', handleMouseOut);
  
    return button;
  }
  
  function Timer(init, prec) { // eslint-disable-line no-unused-vars
  
    const start = new Date(init || null).valueOf();
    const precision = prec || 100;
    let time = start;
  
    setInterval(() => { time += precision; }, precision);
  
    this.elapsed = () => { return time - start; };
    this.getDate = () => { return new Date(time); };
    this.getTimer = () => { return time; };
  }
  
  function containsPoint(bounds, point) { // eslint-disable-line no-unused-vars
    if (point.x < bounds.x) return false;
    if (point.x > bounds.x + bounds.width) return false;
    if (point.y < bounds.y) return false;
    if (point.y > bounds.y + bounds.height) return false;
    return true;
  }
  
  function containsRect(bounds, rect) { // eslint-disable-line no-unused-vars
    if (rect.x - (rect.width / 2) < bounds.x - (bounds.width / 2)) return false;
    if (rect.x + (rect.width / 2) > bounds.x + (bounds.width / 2)) return false;
    if (rect.y - (rect.height / 2) < bounds.y - (bounds.height / 2)) return false;
    if (rect.y + (rect.height / 2) > bounds.y + (bounds.height / 2)) return false;
    return true;
  }
  