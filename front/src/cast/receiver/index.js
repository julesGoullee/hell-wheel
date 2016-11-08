import '../../scss/app.scss';
import { create, launch } from '../../wheel';
import { initialize, send } from './recever';
import config from '../configCast';
import endGame from '../../endGame';
import uuid from 'uuid';

let users = [];
const wheelsQ = [];
let wheelRunningId = false;
let wheelLauncher = null;

function message(nodeRoot, content){

  nodeRoot.innerHTML = `
<div class="center show-anim-fast">
    <div>${content}</div>
</div>`;

}

function findRandomOtherUser(userId){

  const otherUsers = users.filter(user => user.id !== userId);

  if(otherUsers.length > 0){

    return otherUsers[Math.floor(Math.random() * otherUsers.length)];

  }

  return false;

}

function createWheel(nodeRoot, gameName, names, senderId, gameId){ // eslint-disable-line max-params

  console.log(`Wheel send by:${senderId}`);

  wheelRunningId = gameId;

  create(nodeRoot, gameName, names)
    .then( (winName) => {

      wheelLauncher = null;

      console.log(`${winName} win game:${gameName} send by:${senderId}`);

      endGame(nodeRoot, gameName, winName);

      setTimeout( () => {

        wheelRunningId = false;
        wheelLauncher = null;

        if(wheelsQ.length > 0){

          const wheelInQ = wheelsQ.shift();

          const newGameId = uuid.v4();

          createWheel(nodeRoot, wheelInQ.gameName, wheelInQ.names, wheelInQ.senderId, newGameId);

        } else{

          message(nodeRoot, 'Talk to me ...');

        }

      }, 5000);

    });


  const randomOtherUser = findRandomOtherUser(senderId);

  if(randomOtherUser){

    wheelLauncher = randomOtherUser;

    send(randomOtherUser.id, {
      method: config.METHODS.LAUNCH,
      data: { gameId }
    });

  } else{

    wheelLauncher = null;

  }

}

function onConnect(eventConnected){

  const user = { id: eventConnected.senderId };

  users.push(user);
  console.log(`User Connected: ${JSON.stringify(eventConnected, null, 2)}`);
  console.log(JSON.stringify(users, null, 2) );

  if(wheelRunningId && wheelLauncher === null){

    wheelLauncher = user;
    send(wheelLauncher.id, {
      method: config.METHODS.LAUNCH,
      data: { gameId: wheelRunningId }
    });

  }

}

function onDisconnect(eventDisconnect){

  const disconnectUser = users.find(user => user.id === eventDisconnect.senderId);

  users = users.filter(user => user.id !== eventDisconnect.senderId);

  if(wheelLauncher && wheelLauncher.id === disconnectUser.id){

    wheelLauncher = null;
    console.log(`User launcher disconnected:${wheelLauncher.id}`);

  } else{

    console.log(`User disconnected:${eventDisconnect.senderId}`);

  }

  console.log(JSON.stringify(users, null, 2) );

}

function onReady(){

  const nodeRoot = document.getElementById('root');

  function onMessage(eventRes){

    const res = JSON.parse(eventRes.data);

    switch(res.method){

    case config.METHODS.CREATE:

      if(wheelRunningId){

        wheelsQ.push({
          gameName: res.wheel.gameName,
          names: res.wheel.names,
          senderId: eventRes.senderId
        });

      } else{

        const gameId = uuid.v4();

        createWheel(nodeRoot, res.wheel.gameName, res.wheel.names, eventRes.senderId, gameId);

      }
      break;

    case config.METHODS.LAUNCH:

      if(res.wheelId === wheelRunningId){

        launch();

      } else{

        console.error(`LAUNCH incorrect wheel id, sender:${eventRes.senderId}, wheelId: ${res.wheelId}`);

      }
      break;

    default:
      console.error(`No handler for mess type:${res.method}`);

    }

  }

  initialize(onConnect, onDisconnect, onMessage).then( () => {

    console.log('initialize success');
    message(nodeRoot, 'Talk to me ...');

  }).catch(err => console.error(err) );

}

document.addEventListener('DOMContentLoaded', onReady);
