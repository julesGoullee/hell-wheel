navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

export function launch(values){

  if(navigator.vibrate){

    navigator.vibrate(values);

  }

}

export function clean(){

  if(navigator.vibrate){

    navigator.vibrate(0);

  }

}

export default {
  launch,
  stop
};
