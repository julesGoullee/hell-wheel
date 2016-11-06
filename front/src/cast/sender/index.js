import '../../scss/app.scss';
import {
  createWheel,
  initialize,
  onMessage,
  sendLaunchWheel
  } from './send';
import config from '../configCast';

import launchWheel from './launchWheel';

function createBtn(rootNode){

  return new Promise( (resolve, reject) => {

    rootNode.innerHTML += `<button id="create-btn">Create</button>`;

    const btn = document.getElementById('create-btn');

    console.log('listen');
    btn.addEventListener('click', () => {

      createWheel({
        gameName: 'gameTest',
        names: ['j1', 'j2', 'j3', 'j4']
      }).then( () => {

        console.log('Wheel created');
        btn.parentNode.removeChild(btn);

        resolve();

      }).catch(reject);

    });

  });

}

function onReady(){

  const rootNode = document.getElementById('root');

  const castContainer = document.createElement('div');
  const createContainer = document.createElement('div');
  const launchContainer = document.createElement('div');

  rootNode.appendChild(castContainer);
  castContainer.setAttribute('id', 'cast-container');
  rootNode.appendChild(createContainer);
  createContainer.setAttribute('id', 'create-container');
  rootNode.appendChild(launchContainer);
  launchContainer.setAttribute('id', 'launch-container');
  launchContainer.classList.add('show-anim-fast');

  initialize(castContainer).then( () => {

    console.log('Connect session success');

    function onCreate(){

      createBtn(createContainer).then(onCreate).catch(err => console.error(err) );

    }

    createBtn(createContainer).then(onCreate).catch(err => console.error(err) );

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

document.addEventListener('DOMContentLoaded', onReady);
