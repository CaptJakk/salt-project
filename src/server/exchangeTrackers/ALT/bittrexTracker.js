const { S, P } = require('../../../utils/sanctuaryEnv.js');
const { getPriceVolume } = require('../exchangeTracker.js');

const API_URL = 'https://bittrex.com/api/v1.1';

const tickerMap = {
  LTC: {
    BTC: 'btc-ltc'
  },
  ETH: {
    BTC: 'btc-eth'
  },
  DOGE: {
    BTC: 'btc-doge'
  }
};

const tradingPairs = [
  { asset: 'LTC', metric: 'BTC' },
  { asset: 'ETH', metric: 'BTC' },
  { asset: 'DOGE', metric: 'BTC' }
];

const apiEndpoint = S.curry2((asset, metric) => API_URL + '/public/getmarketsummary?market=' + tickerMap[asset][metric]);

const transformResponse = (asset, metric) => data => ({ price: data.result[0].Last, volume: data.result[0].Volume });

module.exports = {
  getPriceVolume: getPriceVolume(tradingPairs, apiEndpoint, transformResponse)
};
