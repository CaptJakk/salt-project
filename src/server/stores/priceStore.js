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

const convertToBtc = (asset, amount) => {
  let pv;
  switch (asset) {
    case BTC:
      return amount;
    case USD:
      pv = getPriceVolume(BTC, USD);
      return pv.value ? amount / pv.value.price : 0;
    default:
      pv = getPriceVolume(asset, BTC);
      return pv.value ? amount * pv.value.price : 0;
  }
};

const convertToUsd = (asset, amount) => {
  let pv;
  switch (asset) {
    case USD:
      return amount;
    case BTC:
      pv = getPriceVolume(BTC, USD);
      return pv.value ? amount * pv.value.price : 0;
    default:
      const priceBtc = convertToBtc(asset, amount);
      return priceBtc && convertToUsd(BTC, priceBtc);
  }
};

module.exports = {
  convertToBtc,
  convertToUsd,
  getAllPriceVolumes,
  getPriceVolume,
  setPriceVolume
};
