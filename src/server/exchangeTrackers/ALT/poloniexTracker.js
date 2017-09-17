const { S } = require('../../../utils/sanctuaryEnv.js');
const { getPriceVolume } = require('../exchangeTracker.js');
const { BTC, LTC, ETH, DOGE } = require('../../../utils/symbolConstants.js');

const API_URL = 'https://shapeshift.io';

const tickerMap = {
  [LTC]: {
    [BTC]: 'BTC_LTC'
  },
  [ETH]: {
    [BTC]: 'BTC_ETH'
  },
  [DOGE]: {
    [BTC]: 'BTC_DOGE'
  }
};

const tradingPairs = [
  { asset: LTC, metric: BTC },
  { asset: ETH, metric: BTC },
  { asset: DOGE, metric: BTC }
];

const apiEndpoint = S.curry2((asset, metric) => API_URL + '/rate/' + tickerMap[asset][metric]);

const transformResponse = (asset, metric) => data => {
  const ticker = data[tickerMap[asset][metric]];
  return { price: ticker.last, volume: ticker.quoteVolume };
};

module.exports = {
  getPriceVolume: getPriceVolume(tradingPairs, apiEndpoint, transformResponse)
};
