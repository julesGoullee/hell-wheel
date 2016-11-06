import '../../scss/app.scss';
import { initialize, send } from './recever';
import config from '../configCast';
import endGame from '../../endGame';
import { create, launch } from '../../wheel';

let users = [];

function createWheel(nodeRoot, gameName, names, creatorId){

  console.log(`Wheel create by:${creatorId}`);

  create(nodeRoot, gameName, names)
    .then( (winName) => {

      console.log(`${winName} win game:${gameName} create by:${creatorId}`);

      endGame(nodeRoot, gameName, winName);

      // nodeRoot.innerHTML += linkNew;

    });

  send(creatorId, {
    method: config.METHODS.LAUNCH,
    data: { gameId: 'gameId' }
  });

}

function onConnect(eventConnected){

  users.push({ id: eventConnected.senderId });

  console.log(`User Connected: ${eventConnected.senderId}`);

  // console.log(castReceiverManager.getSender(eventConnected.data).userAgent);

}

function onDisconnect(eventDisconnect){

  users = users.filter(user => user.id !== eventDisconnect.senderId);
  console.log(`User Disconnected: ${eventDisconnect.senderId}`);

}

function onReady(){

  const rootNode = document.getElementById('root');

  function onMessage(eventRes){

    const res = JSON.parse(eventRes.data);

    switch(res.method){

    case config.METHODS.CREATE:

      createWheel(rootNode, res.wheel.gameName, res.wheel.names, eventRes.senderId);
      break;

    case config.METHODS.LAUNCH:

      launch();
      break;

    default:
      console.error(`No handler for mess type:${res.method}`);

    }

  }

  initialize(onConnect, onDisconnect, onMessage).then( () => {

    console.log('initialize success');

  }).catch(err => console.error(err) );

}

document.addEventListener('DOMContentLoaded', onReady);
