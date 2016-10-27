const config = require('../config/config');

module.exports = server => {

  server.on('uncaughtException', (req, res, route, err) => {

    if(config.env === 'production'){

      console.error(err);
      res.send(500);

    } else{

      throw err;

    }

  });

};
