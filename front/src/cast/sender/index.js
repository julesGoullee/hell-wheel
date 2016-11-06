import '../../scss/app.scss';
import {
  createWheel,
  initialize,
  onDisconnect,
  onMessage,
  sendLaunchWheel
  } from './send';

import config from '../configCast';
import enterGame from '../../enterGame';
import enterNames from '../../enterNames';
import launchWheel from './launchWheel';

function onReady(){

  const rootNode = document.getElementById('root');
  const castContainer = document.createElement('div');
  const createContainer = document.createElement('div');
  const launchContainer = document.createElement('div');

  rootNode.innerHTML = '';
  rootNode.appendChild(castContainer);
  castContainer.setAttribute('id', 'cast-container');
  rootNode.appendChild(createContainer);
  createContainer.setAttribute('id', 'create-container');
  rootNode.appendChild(launchContainer);
  launchContainer.setAttribute('id', 'launch-container');
  launchContainer.classList.add('show-anim-fast');

  async function userEnter(){

    const names = await enterNames(createContainer);
    const gameName = await enterGame(createContainer, names);

    return {
      names,
      gameName
    };

  }

  initialize(castContainer).then( () => {

    console.log('Connect session success');

    function onCreate({ names, gameName }){

      createWheel({
        gameName: gameName,
        names: names
      }).then( () => {

        console.log('Wheel created');
        userEnter().then(onCreate).catch(err => console.error(err.stack) );

      }).catch(err => console.error(err.stack) );

    }

    userEnter().then(onCreate).catch(err => console.error(err.stack) );

    onMessage( (channel, stringRes) => {

      const res = JSON.parse(stringRes);

      console.log('onMessage', `res:${JSON.stringify(res, null, 2)}`);

      switch(res.method){

      case config.METHODS.LAUNCH:

        launchWheel(launchContainer).then( () => {

          console.log(`Launch:${res.data.gameId}`);
          sendLaunchWheel(res.data.gameId);

        });
        break;

      default:
        console.error(`No handler for mess type:${res.method}`);

      }

    });

  }).catch(err => console.error(err.stack) );

}

onDisconnect( () => {

  const rootNode = document.getElementById('root');

  rootNode.innerHTML = 'Disconnect';
  console.info('Err:Disconnected');

  setTimeout( () => {

    onReady();

  }, 1500);

});

document.addEventListener('DOMContentLoaded', onReady);
