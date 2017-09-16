const { create, env } = require('sanctuary');
const { env: flutureEnv, FutureType } = require('fluture-sanctuary-types');
const Future = require('fluture');
const checkTypes = process.env.NODE_ENV !== 'production';
const S = create({checkTypes, env: env.concat(flutureEnv)});

const bitfinexTracker = require('./exchangeTrackers/bitfinexTracker.js');
const gdaxTracker = require('./exchangeTrackers/gdaxTracker.js');
const krakenTracker = require('./exchangeTrackers/krakenTracker.js');

// exchangeTrackers :: [(String, String) -> Future Error PriceVolume]
let exchangeTrackers = [
  bitfinexTracker.getPriceVolume,
  gdaxTracker.getPriceVolume,
  krakenTracker.getPriceVolume
];

// data PriceVolume = { price :: Number, volume :: Number }

// pvProduct :: PriceVolume -> Number
const pvProduct = exchangeA => exchangeA.price * exchangeA.volume;

// reduceVolumeAverage :: PriceVolume -> PriceVolume -> PriceVolume
const pvAverage = S.curry2((exchangeA, exchangeB) => {
  const numerator = pvProduct(exchangeA) + pvProduct(exchangeB);
  const denominator = exchangeA.volume + exchangeB.volume;
  return { price: numerator / denominator, volume: denominator };
});

// priceVolumeOfPair :: [(String, String) -> Future Error PriceVolume] -> String -> String -> Future Error PriceVolume
const priceVolumeOfPair = S.curry3((trackers, asset, metric) =>
  S.reduce(
    S.lift2(pvAverage),
    Future.of({ price: 0, volume: 0 }),
    S.map(tracker => tracker(asset, metric), trackers)
  ));

module.exports = {
  exchangeTrackers,
  priceVolumeOfPair,
  pvAverage
};
