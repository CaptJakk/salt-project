const { F } = require('./sanctuaryEnv');
const axios = require('axios');

const get = F.encaseP(axios.get);

const faxios = {
  get
};

module.exports = faxios;
