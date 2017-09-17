const { S } = require('../../../utils/sanctuaryEnv.js');
const { getPriceVolume } = require('../exchangeTracker.js');
const { USD, BTC } = require('../../../utils/symbolConstants.js');

const API_URL = 'https://api.gdax.com';

const tickerMap = {
  [BTC]: {
    [USD]: 'BTC-USD'
  }
};

const tradingPairs = [{ asset: BTC, metric: USD }];

const apiEndpoint = S.curry2((asset, metric) => API_URL + '/products/' + tickerMap[asset][metric] + '/ticker');

const transformResponse = (asset, metric) => data => ({ price: data.price, volume: data.volume });

module.exports = {
  getPriceVolume: getPriceVolume(tradingPairs, apiEndpoint, transformResponse)
};
