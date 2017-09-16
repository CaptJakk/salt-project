const { S, F } = require('../../../utils/sanctuaryEnv.js');
const faxios = require('../../../utils/faxios.js');

const API_URL = 'https://api.kraken.com';

const getPriceVolume = S.curry2((asset, metric) => {
  if (asset === 'BTC' && metric === 'USD') {
    return faxios.get(API_URL + '/0/public/Ticker?pair=XXBTZUSD')
      .map(res => res.data.result.XXBTZUSD)
      .map(data => ({ price: data.c[0], volume: data.v[1] }))
      .fork(console.error, console.log);
  } else {
    return F.reject(new Error(`Unsupported Trading Pair: { asset: ${asset}, metric: ${metric}`));
  }
});

module.exports = {
  getPriceVolume
};
