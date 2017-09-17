const { S } = require('../../../utils/sanctuaryEnv.js');
const { getPriceVolume } = require('../exchangeTracker.js');

const API_URL = 'https://api.bitfinex.com/v1';

const tickerMap = {
  BTC: {
    USD: 'btcusd'
  }
};

const tradingPairs = [{ asset: 'BTC', metric: 'USD' }];

const apiEndpoint = S.curry2((asset, metric) => API_URL + '/pubticker/' + tickerMap[asset][metric]);

const transformResponse = (asset, metric) => data => ({ price: data.last_price, volume: data.volume });

module.exports = {
  getPriceVolume: getPriceVolume(tradingPairs, apiEndpoint, transformResponse)
};
