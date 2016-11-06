import '../../scss/app.scss';
import {
  createWheel,
  initialize,
  onMessage,
  sendLaunchWheel,
  requestSession
} from './send';
import config from '../configCast';

import launchWheel from './launchWheel';

function onReady(){

  const rootNode = document.getElementById('root');

  initialize().then( () => {

    console.log('init success');

    requestSession(rootNode).then( () => {

      console.log('Connect session success');

      createWheel({
        gameName: 'gameTest',
        names: ['j1', 'j2', 'j3', 'j4']
      }).then( () => {

      });

      onMessage( (channel, stringRes) => {

        const res = JSON.parse(stringRes);

        console.log('onMessage', `res:${JSON.stringify(res, null, 2)}`);

        switch(res.method){

        case config.METHODS.LAUNCH:

          launchWheel(rootNode).then( () => {

            console.log(`Launch:${res.data.gameId}`);
            sendLaunchWheel(res.data.gameId);

          });
          break;

        default:
          console.error(`No handler for mess type:${res.method}`);

        }

      });

    }).catch(err => console.error(err.stack) );


  }).catch(err => console.error(err.stack) );

}

document.addEventListener('DOMContentLoaded', onReady);
