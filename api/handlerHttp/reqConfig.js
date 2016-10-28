const restify = require('restify');

module.exports = (server) => {

  server.use(restify.fullResponse() );
  server.use(restify.CORS({ // eslint-disable-line new-cap
    'origins': ['*'],
    'credentials': true
  }) );

  //clean req path
  server.pre(restify.pre.sanitizePath() );
  restify.acceptParser(server.acceptable);
  server.use(restify.queryParser() );
  server.use(restify.bodyParser() );

  server.opts(/\.*/, (req, res, next) => {

    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.send(200);
    next();

  });

};
