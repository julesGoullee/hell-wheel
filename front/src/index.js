// Inject inline sass
import './scss/app.scss';

import { createWheel, getWheelById } from './connector';
import endGame from './endGame';
import enterGame from './enterGame';
import enterNames from './enterNames';
import getUrl from './getUrl';
import launch from './wheel';
import showError from './showError';
import showLink from './showLink';
import linkNew from './linkNew';

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

      launch(nodeRoot, gameName, names, id)
        .then( (winName) => {

          endGame(nodeRoot, gameName, winName);
          nodeRoot.innerHTML += linkNew;

        });

    }).catch( () => {

      showError(nodeRoot, 'To late guys !');
      nodeRoot.innerHTML += linkNew;

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
