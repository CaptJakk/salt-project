const { F } = require('./sanctuaryEnv');
const axios = require('axios');

const get = F.encaseP2(axios.get);
const post2 = F.encaseP2(axios.post);
const post3 = F.encaseP3(axios.post);

const faxios = {
  get,
  post2,
  post3
};

module.exports = faxios;
