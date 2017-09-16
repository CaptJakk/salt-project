const { S, F } = require('../../../utils/sanctuaryEnv.js');
const faxios = require('../../../utils/faxios.js');

const API_URL = 'https://api.bitfinex.com/v1/';

const getPriceVolume = S.curry2((asset, metric) => {
  if (asset === 'BTC' && metric === 'USD') {
    return faxios.get(API_URL + '/pubticker/btcusd')
      .map(res => res.data)
      .map(data => ({ price: data.last_price, volume: data.volume }));
  } else {
    return F.reject(new Error(`Unsupported Trading Pair: { asset: ${asset}, metric: ${metric}`));
  }
});

module.exports = {
  getPriceVolume
};
