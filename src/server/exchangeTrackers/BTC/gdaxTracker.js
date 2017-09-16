const { S, F } = require('../../../utils/sanctuaryEnv.js');
const faxios = require('../../../utils/faxios.js');

const API_URL = 'https://api.gdax.com';

const getPriceVolume = S.curry2((asset, metric) => {
  if (asset === 'BTC' && metric === 'USD') {
    return faxios.get(API_URL + '/products/BTC-USD/ticker')
      .map(res => res.data)
      .map(data => ({ price: data.price, volume: data.volume }));
  } else {
    return F.reject(new Error(`Unsupported Trading Pair: { asset: ${asset}, metric: ${metric}`));
  }
});

module.exports = {
  getPriceVolume
};
