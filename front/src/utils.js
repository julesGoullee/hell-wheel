export function isMob(){

  return window.innerWidth <= 800 && window.innerHeight <= 600;

}

export function toggleFullScreen(){ // eslint-disable-line complexity

  const doc = window.document;
  const docEl = doc.documentElement;

  const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement){

    requestFullScreen.call(docEl);

  } else{

    cancelFullScreen.call(doc);

  }

}

export default {
  isMob,
  toggleFullScreen
};
