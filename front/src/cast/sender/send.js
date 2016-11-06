import config from '../configCast';
import iconCast from './img/cast';

let session = null;
const TIMEOUT_RESTORE_SESSION = 1000;
let disconnectHandler = null;

export function onDisconnect(cb){

  disconnectHandler = cb;

}

function sessionUpdateListener(isAlive){

  let message = isAlive ? 'Session Updated' : 'Session Removed';

  message += `: ${session.sessionId}`;
  console.log(message);

  if(!isAlive){

    console.log('isAlive', isAlive);
    session = null;

    if(typeof disconnectHandler === 'function'){

      chrome.cast.isAvailable = false;
      disconnectHandler();

    }

  }

}

function createSession(){

  return new Promise( (resolve, reject) => {

    chrome.cast.requestSession(resolve, reject);

  });

}

function requestBtn(rootNode, iconNode, cb){

  return () => {

    function onEnd(e){

      session = e;
      session.addUpdateListener(sessionUpdateListener);
      iconNode.removeEventListener('click', cb);
      rootNode.innerHTML = '';
      window.addEventListener('beforeunload', () => {

        session.leave();

      });

      cb(session);

    }

    createSession().then( (eventCreate) => {

      console.log(`CreateSession success ${eventCreate.sessionId}`);
      onEnd(eventCreate);

    }).catch( (err) => {

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

    rootNode.innerHTML = `<div id="request-cast-icon" class="scale-anim icon-cast">${iconCast}</div>`;

    const iconNode = document.getElementById('request-cast-icon');

    iconNode.addEventListener('click', requestBtn(rootNode, iconNode, resolve) );

  });

}

function initializeCastApi(rootNode){

  return new Promise( (resolve, reject) => {

    let timerRestoreSession = null;
    const applicationID = '7AB5D530';

    // auto join policy can be one of the following three
    // 1) no auto join
    // 2) same appID, same URL, same tab
    // 3) same appID and same origin URL
    const autoJoinPolicyArray = [
      chrome.cast.AutoJoinPolicy.PAGE_SCOPED,
      chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED,
      chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    ];

    const autoJoin = autoJoinPolicyArray[2];

    function sessionListener(e){

      clearTimeout(timerRestoreSession);

      console.log(`Session ID: ${e.sessionId}`);
      session = e;
      session.addUpdateListener(sessionUpdateListener);
      window.addEventListener('beforeunload', () => {

        session.leave();

      });
      rootNode.innerHTML = '';
      resolve();

    }

    function receiverListener(e){

      if(e === chrome.cast.ReceiverAvailability.AVAILABLE){

        console.log('cast found');

      } else{

        console.log('cast list empty');

      }

    }

    // request session
    const sessionRequest = new chrome.cast.SessionRequest(applicationID, null, null, true);
    const apiConfig = new chrome.cast.ApiConfig(
      sessionRequest,
      sessionListener,
      receiverListener,
      autoJoin
    );

    chrome.cast.initialize(apiConfig, () => {

      console.log('initialize success');

      timerRestoreSession = setTimeout( () => {

        console.log('Request session...');
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

      reject(new Error('No cast support') );

    }

  });

}

export default {
  initialize,
  requestSession,
  createWheel
};
