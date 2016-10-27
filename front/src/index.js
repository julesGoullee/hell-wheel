//https://github.com/zilverline/react-tap-event-plugin Needed for onTouchTap
// Inject inline sass
import './scss/app.scss';

import enterNames from './enterNames';
import enterGame from './enterGame';
import launch from './wheel';
import endGame from './endGame';
import getUrl from './getUrl';
import {getWheelById, createWheel, launchWheel} from './connector';
import showLink from './showLink';
import showError from './showError';

document.addEventListener('DOMContentLoaded', () => {

  const root = document.getElementById('root');
  let names = [];
  let gameName = '';

  getUrl().then(id => {

    if(id){

      getWheelById(id).then( (res) => {

        gameName = res.gameName;
        names = res.names;

        launch(root, gameName, names)
          .then((winName) => {
            launchWheel(id);
            endGame(root, gameName, winName)
          });

      }).catch(err => {

        showError(root, 'To late guys !');

      });

    } else {

      enterNames(root).then(enterNames => {

        names = enterNames;
        enterGame(root, names).then((enterGameName) => {

          gameName = enterGameName;

          createWheel(gameName, names).then( (res) => {

            showLink(root, res.id);

          });

        });

      });
    }

  }).catch(err => {
      console.error(err.stack);

    });

});
