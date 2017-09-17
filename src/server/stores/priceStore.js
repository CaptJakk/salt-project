const { USD, BTC, LTC, ETH, DOGE } = require('../../utils/symbolConstants.js');
const { S } = require('../../utils/sanctuaryEnv.js');
const priceVolumes = {
  [BTC]: {
    [USD]: null
  },
  [ETH]: {
    [BTC]: null
  },
  [LTC]: {
    [BTC]: null
  },
  [DOGE]: {
    [BTC]: null
  }
};

const unsafeGetPriceVolume = (asset, metric) => JSON.parse(JSON.stringify(priceVolumes[asset][metric]));

const getAllPriceVolumes = () => JSON.parse(JSON.stringify(priceVolumes));

// getPriceVolume :: (String, String) -> Either Error PriceVolume
const getPriceVolume = (asset, metric) =>
  S.maybeToEither(
    new Error(`Invalid Trading Pair ${asset}-${metric}`),
    S.chain(
      S.toMaybe,
      S.encase2_(
        unsafeGetPriceVolume,
        asset,
        metric
      )
    )
  );

const setPriceVolume = S.curry3((asset, metric, pv) => {
  priceVolumes[asset][metric] = pv;
});

module.exports = {
  getAllPriceVolumes,
  getPriceVolume,
  setPriceVolume
};
