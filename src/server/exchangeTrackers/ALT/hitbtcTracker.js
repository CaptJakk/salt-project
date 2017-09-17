const { S } = require('../../../utils/sanctuaryEnv.js');
const { getPriceVolume } = require('../exchangeTracker.js');

const API_URL = 'https://api.hitbtc.com';

const tickerMap = {
  LTC: {
    BTC: 'LTCBTC'
  },
  ETH: {
    BTC: 'ETHBTC'
  },
  DOGE: {
    BTC: 'DOGEBTC'
  }
};

const tradingPairs = [
  { asset: 'LTC', metric: 'BTC' },
  { asset: 'ETH', metric: 'BTC' },
  { asset: 'DOGE', metric: 'BTC' }
];

const apiEndpoint = S.curry2((asset, metric) => API_URL + '/api/1/public/' + tickerMap[asset][metric] + '/ticker');

const transformResponse = (asset, metric) => data => ({ price: data.last, volume: data.volume });

module.exports = {
  getPriceVolume: getPriceVolume(tradingPairs, apiEndpoint, transformResponse)
};
