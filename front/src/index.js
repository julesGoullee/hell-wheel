// Inject inline sass
import './scss/app.scss';

import { createWheel, getWheelById, launchWheel } from './connector';
import endGame from './endGame';
import enterGame from './enterGame';
import enterNames from './enterNames';
import getUrl from './getUrl';
import { create } from './wheel';
import linkNew from './linkNew';
import showError from './showError';
import showLink from './showLink';
const timerWin = 2500;

function onReady(){

  const nodeRoot = document.getElementById('root');
  let names = [];
  let gameName = '';

  const id = getUrl();

  async function userEnter(){

    names = await enterNames(nodeRoot);
    gameName = await enterGame(nodeRoot, names);

    return {
      names,
      gameName
    };

  }

  if(id){

    getWheelById(id).then( (res) => {

      gameName = res.gameName;
      names = res.names;

      create(nodeRoot, gameName, names)
        .then( (winName) => {

          launchWheel(id);

          setTimeout( () => {

            endGame(nodeRoot, gameName, winName);
            nodeRoot.innerHTML += linkNew;

          }, timerWin);

        });

    }).catch( (err) => {

      showError(nodeRoot, 'To late guys !');
      nodeRoot.innerHTML += linkNew;
      console.error(err);

    });

  } else{

    userEnter().then( () => {

      createWheel(gameName, names).then( (res) => {

        showLink(nodeRoot, res.id);

      });

    }).catch(err => console.error(err.stack) );

  }

}

document.addEventListener('DOMContentLoaded', onReady);
