const log = require('npmlog');
const config = require('./config');
const logLevel = config.ENV === 'production' ? 'info' : 'silly';

log.level = logLevel;
log.on('log', (mess) => {

  mess.prefix = `[${new Date().toUTCString()}][${mess.prefix}]`;

  return mess;

});
