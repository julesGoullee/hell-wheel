import config from './config';

function checkStatus(res){

  if(res.status < 200 || res.status > 300){

    const err = new Error(res.statusText);

    err.response = res;
    throw err;

  }

  return res;

}

function parseJSON(res){

  return res.json();

}

function request(method, path, body){

  return new Promise( (resolve, reject) => {

    fetch(`${config.API_HOST}${path}`, {
      method: method,
      credentials: 'include',
      mode: 'cors',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body)
    })
      .then(checkStatus)
      .then(parseJSON)
      .then( (data) => {

        resolve(data);

      })
      .catch( (err) => {

        reject(err.stack);

      });

  });

}

export function getWheelById(id){

  return request('post', '/getWheel', { id });

}

export function createWheel(gameName, names){

  return request('post', '/createWheel', {
    gameName, names
  });

}

export function launchWheel(id){

  return request('post', '/launchWheel', { id });

}

export default {
  getWheelById, createWheel, launchWheel
};
