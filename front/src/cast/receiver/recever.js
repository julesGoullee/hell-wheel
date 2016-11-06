import config from '../configCast';

let castReceiverManager = null;
let messageBusWheel = null;

// cast.receiver.logger.setLevelValue(0);
cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG);

export function initialize(onConnect, onDisconnect, onMessage){

  return new Promise( (resolve) => {

    castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
    castReceiverManager.setApplicationState('Loading');
    messageBusWheel = castReceiverManager.getCastMessageBus(config.NAMESPACE_WHEEL);
    castReceiverManager.onSenderConnected = onConnect;
    castReceiverManager.onSenderDisconnected = onDisconnect;
    messageBusWheel.onMessage = onMessage;
    castReceiverManager.start({ statusText: 'Hell-wheel' });
    //
    // const appConfig = new cast.receiver.CastReceiverManager.Config();
    // appConfig.statusText = 'Hell-wheel';
    // appConfig.maxInactivity = 6000;
    //
    // // Create the game before starting castReceiverManager to make sure any extra
    // // cast namespaces can be set up.
    // const gameConfig = new cast.receiver.games.GameManagerConfig();
    //
    // gameConfig.applicationName = 'Hell-wheel';
    //
    // const gameManager = new cast.receiver.games.GameManager(gameConfig);
    //
    // castReceiverManager.start(appConfig);

    castReceiverManager.onReady = (e) => {

      console.log(`Cast Ready:${JSON.stringify(e.data, null, 2)}`);

      resolve();

    };

  });

}

export function send(senderId, data){

  console.log('Send', `To:${senderId}, data:${JSON.stringify(data)}`);

  messageBusWheel.send(senderId, JSON.stringify(data) );

}

//
// console.log('Message [' + event.senderId + ']: ' + event.data);
// // display the message from the sender
// displayText(event.data);
// // inform all senders on the CastMessageBus of the incoming message event
// // sender message listener will be invoked
// messageBus.send(event.senderId, event.data);
// };
//
// function onConnect(cb){
//
//   castReceiverManager.onSenderConnected = (eventConnected) => {
//
//     console.log(`Received Sender Connected event: ${eventConnected.data}`);
//     console.log(castReceiverManager.getSender(eventConnected.data).userAgent);
//     debugger;
//     cb(eventConnected);
//
//   };
//
// }
//
// function onDisconnect(cb){
//
//   castReceiverManager.onSenderDisconnected = (eventConnected) => {
//
//     console.log(`Received Sender Disconnected event: ${eventConnected.data}`);
//     console.log(castReceiverManager.getSender(eventConnected.data).userAgent);
//
//     if(castReceiverManager.getSenders().length === 0){
//
//       console.log(`0 sender connect`);
//
//       // close();
//
//     }
//     cb(eventConnected);
//
//   };
//
// }
//
// function a(){
//     // create a CastMessageBus to handle messages for a custom namespace
//
// // handler for the CastMessageBus message event
//
//   console.log('Receiver Manager started');
//
//   // utility function to display the text message in the input field
//   function displayText(text){
//
//     console.log(text);
//     document.getElementById('root').innerHTML = text;
//     castReceiverManager.setApplicationState(text);
//
//   }
//
// }

export default {
  initialize,
  // send
};
