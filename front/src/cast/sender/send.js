import config from '../configCast';
const iconPath = require('./img/cast_icon_idle.png');

let session = null;
const TIMEOUT_RESTORE_SESSION = 1000;

function sessionUpdateListener(isAlive){

  let message = isAlive ? 'Session Updated' : 'Session Removed';

  message += `: ${session.sessionId}`;
  console.log(message);

  if(!isAlive){

    session = null;

  }

}

function requestBtn(rootNode, iconNode, cb){

  return () => {

    chrome.cast.requestSession( (e) => {

      console.log(`requestBtn New Session ${e.sessionId}`);
      session = e;
      session.addUpdateListener(sessionUpdateListener);
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

function requestSession(rootNode){

  return new Promise( (resolve) => {

    rootNode.innerHTML = `<img id="request-cast-icon" src="/${iconPath}" class="icon-cast"/>`;

    const iconNode = document.getElementById('request-cast-icon');

    iconNode.addEventListener('click', requestBtn(rootNode, iconNode, resolve) );

  });

}

function initializeCastApi(rootNode){

  return new Promise( (resolve, reject) => {

    let timerRestoreSession = null;

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

    function sessionListener(e){

      clearTimeout(timerRestoreSession);
      console.log(`New session ID: ${e.sessionId}`);
      session = e;
      session.addUpdateListener(sessionUpdateListener);

      resolve();

    }

    function receiverListener(e){

      if(e === 'available'){

        console.log('cast found');

      } else{

        console.log('cast list empty');

      }

    }

    // request session
    const sessionRequest = new chrome.cast.SessionRequest(applicationIDs[0]);
    const apiConfig = new chrome.cast.ApiConfig(
      sessionRequest,
      sessionListener,
      receiverListener,
      autoJoinPolicyArray[2]
    );

    chrome.cast.initialize(apiConfig, () => {

      console.log('initialize success');

      timerRestoreSession = setTimeout( () => {

        console.log('Request new session...');
        requestSession(rootNode).then(resolve).catch(reject);

      }, TIMEOUT_RESTORE_SESSION);

    }, reject);

  });

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

export function initialize(rootNode){

  return new Promise( (resolve, reject) => {

    if(!chrome.cast || !chrome.cast.isAvailable){

      setTimeout( () => {

        initializeCastApi(rootNode).then(resolve).catch(reject);

      }, config.CAST_API_INITIALIZATION_DELAY);


    } else{

      reject('No cast support');

    }

  });

}

export default {
  initialize,
  requestSession,
  createWheel
};
