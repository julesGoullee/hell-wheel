const path = require('path');
const fs = require('fs');
const log = require('npmlog');
const{ API_PORT } = require('../config/config');
const restify = require('restify');
const middlewareError = require('./error');
const{
 addWheel, getWheelById, destroyById
} = require('../wheels');
const middlewaresReqConfig = require('./reqConfig');
const indexString = fs.readFileSync(path.resolve(__dirname, '../../front/build/index.html') ).toString('utf-8');
const server = restify.createServer({
  'name': 'capture-radio-stream',
  'version': '0.0.1'
});

middlewaresReqConfig(server);

function reqCreateWheel(req, res, next){

  if(typeof req.params.gameName === 'string' && req.params.gameName.length > 2 &&
      Array.isArray(req.params.names) && req.params.names.length >= 2){

    next();

  } else{

    res.send(400, 'missing params');

  }

}

server.post('/createWheel', reqCreateWheel, (req, res, next) => {

  const id = addWheel(req.params.gameName, req.params.names);

  res.send(201, { id });
  next(false);

});


function reqWheelValid(req, res, next){

  if(typeof req.params.id === 'string' && req.params.id.length > 3){

    next();

  } else{

    res.send(400, 'missing params');
    next(false);

  }

}

server.post('/getWheel', reqWheelValid, (req, res, next) => {

  const wheel = getWheelById(req.params.id);

  if(wheel){

    res.send(200, wheel);

  } else{

    res.send(400, 'Not found');

  }

  next(false);

});

server.post('/launchWheel', reqWheelValid, (req, res, next) => {

  const wheel = getWheelById(req.params.id);

  if(wheel){

    const isValid = destroyById(wheel.id);

    if(isValid){

      res.send(200);

    } else{

      res.send(400);
    
    }

  } else{

    res.send(400, 'Not found');

  }

  next(false);

});


server.get('/:id', (req, res, next) => {

  log.info('wheel', `Get ${req.params.id}`);

  res.header('Content-Type', 'text/html');
  const ind = indexString.toString();

  res.end(ind);
  next(false);

});

server.get(/\.*/, restify.serveStatic({
  'directory': path.resolve(__dirname, '../../front/build'),
  'default': 'index.html'
}) );

middlewareError(server);

function listen(){

  server.listen(API_PORT, () => {

    log.info('http', `Http server listen on port:${API_PORT}`);

  });

}
module.exports = { listen };
