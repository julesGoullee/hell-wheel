const log = require('npmlog');
const crypto = require('crypto');

function randomValueHex(len){

  return crypto.randomBytes(Math.ceil(len / 2) )
    .toString('hex')
    .slice(0, len);

}

let wheels = [];

function addWheel(gameName, names){

  log.info('wheel', `Add ${gameName}`);

  const id = randomValueHex(6);

  wheels.push({
    gameName, names, id
  });

  return id;

}

function getWheelById(id){

  log.info('wheel', `Get ${id}`);

  return wheels.find(wheel => wheel.id === id);

}

function destroyById(id){

  log.info('wheel', `Destroy ${id}`);

  const lastSize = wheels.length;

  wheels = wheels.filter(wheel => wheel.id !== id);
  const newSize = wheels.length;

  return newSize !== lastSize;

}

module.exports = {
  addWheel, getWheelById, destroyById
};
