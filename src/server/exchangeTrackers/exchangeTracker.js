const { S, F } = require('../../utils/sanctuaryEnv.js');
const faxios = require('../../utils/faxios.js');

const getPriceVolume = S.curry3((tradingPairs, apiEndpoint, transformResponse) => S.curry2((asset, metric) => {
  if (S.contains({ asset, metric }, tradingPairs)) {
    return faxios.get(apiEndpoint(asset, metric))
      .map(res => res.data)
      .map(transformResponse(asset, metric))
      .chain(pv => {
        const price = parseFloat(pv.price);
        const volume = parseFloat(pv.volume);
        if (isNaN(price)) {
          return F.reject(new Error(`The price returned by the API is not a numeric value: ${pv.price}`));
        }
        if (isNaN(volume)) {
          return F.reject(new Error(`The volume returned by the API is not a numeric value: ${pv.volume}`));
        } else {
          return F.of({ price, volume });
        }
      });
  } else {
    return F.reject(new Error(`Unsupported Trading Pair: { asset: ${asset}, metric: ${metric} }`));
  }
}));

module.exports = {
  getPriceVolume
};
