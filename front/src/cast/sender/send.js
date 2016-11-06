import config from '../configCast';
const iconPath = require('./img/cast_icon_idle.png');

let session = null;

function initializeCastApi(){

  return new Promise( (resolve, reject) => {

    const applicationIDs = [
      '7AB5D530',
      chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    ];

    // auto join policy can be one of the following three
    // 1) no auto join
    // 2) same appID, same URL, same tab
    // 3) same appID and same origin URL
    const autoJoinPolicyArray = [
      chrome.cast.AutoJoinPolicy.PAGE_SCOPED,
      chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED,
      chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    ];

    // request session
    const sessionRequest = new chrome.cast.SessionRequest(applicationIDs[0]);
    const apiConfig = new chrome.cast.ApiConfig(
      sessionRequest,
      sessionListener,
      receiverListener,
      autoJoinPolicyArray[0]
    );

    chrome.cast.initialize(apiConfig, resolve, reject);

  });

}

function onError(e){

  console.error(`onError: ${JSON.stringify(e)}`);
  throw e;

}

function onStopAppSuccess(){

  console.log('onStopAppSuccess');

}

function sessionUpdateListener(isAlive){

  let message = isAlive ? 'Session Updated' : 'Session Removed';

  message += `: ${session.sessionId}`;
  console.log(message);

  if(!isAlive){

    session = null;

  }

}

function onCreateWheel(namespaceMess, message){

  console.log(`receiverMessage: ${namespaceMess}, ${message}`);

}

function sessionListener(e){

  console.log(`New session ID: ${e.sessionId}`);
  session = e;
  session.addUpdateListener(sessionUpdateListener);


}

function receiverListener(e){

  if(e === 'available'){

    console.log('receiver found');

  } else{

    console.log('receiver list empty');

  }

}

function stopApp(){

  session.stop(onStopAppSuccess, onError);

}

function requestBtn(rootNode, iconNode, cb){

  return () => {

    chrome.cast.requestSession( (e) => {

      session = e;
      iconNode.removeEventListener('click', cb);
      rootNode.innerHTML = '';
      cb(session);

    }, (err) => {

      if(err.code === 'cancel'){

        console.log('cancel');

      } else{

        console.error(err);

      }

    });

  };

}

function send(namespaceToSend, message){

  return new Promise( (resolve, reject) => {

    session.sendMessage(namespaceToSend, message, resolve, reject);

  });

}

export function createWheel(wheel){

  console.log('send', `Wheel:${JSON.stringify(wheel, null, 2)}`);

  return send(config.NAMESPACE_WHEEL, {
    method: config.METHODS.CREATE,
    wheel
  });

}

export function sendLaunchWheel(wheelId){

  console.log('send', `LaunchWheel wheelId: ${wheelId}`);

  return send(config.NAMESPACE_WHEEL, {
    method: config.METHODS.LAUNCH,
    wheelId
  });

}

export function onMessage(cb){

  session.addMessageListener(config.NAMESPACE_WHEEL, cb);

}


export function requestSession(rootNode){

  return new Promise( (resolve) => {

    rootNode.innerHTML = `<img id="request-cast-icon" src="/${iconPath}" class="icon-cast"/>`;

    const iconNode = document.getElementById('request-cast-icon');

    iconNode.addEventListener('click', requestBtn(rootNode, iconNode, resolve) );

  });

}

export function initialize(){

  return new Promise( (resolve, reject) => {

    if(!chrome.cast || !chrome.cast.isAvailable){

      setTimeout( () => {

        initializeCastApi().then(resolve).catch(reject);

      }, config.CAST_API_INITIALIZATION_DELAY);


    } else{

      reject('Not cast support');

    }

  });

}

export default {
  initialize,
  requestSession,
  createWheel
};
