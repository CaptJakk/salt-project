/* eslint-env jest */
/* eslint-disable no-unused-expressions */
const priceTracker = require('../../src/server/priceTracker.js');
const {
  priceVolumeOfPair,
  pvAverage
} = priceTracker;

describe('pvAverage', () => {
  test('10p10v + 20p5v == 13.33p15v', () => {
    const exchangeA = { price: 10, volume: 10 };
    const exchangeB = { price: 20, volume: 5 };
    expect(pvAverage(exchangeA, exchangeB).price).toBeCloseTo(13.33, 2);
    expect(pvAverage(exchangeA, exchangeB).volume).toBe(15);
  });
  test('5p50v + 6p30v == 5.38p80v', () => {
    const exchangeA = { price: 5, volume: 50 };
    const exchangeB = { price: 6, volume: 30 };
    expect(pvAverage(exchangeA, exchangeB).price).toBeCloseTo(5.38, 2);
    expect(pvAverage(exchangeA, exchangeB).volume).toBe(80);
  });
});
describe('priceVolumeOfPair', () => {
  test('10p10v + 5p10v + 15p10v == 10p30v', () => {
    const trackerA = (asset, metric) => Future.of({ price: 10, volume: 10 });
    const trackerB = (asset, metric) => Future.of({ price: 5, volume: 10 });
    const trackerC = (asset, metric) => Future.of({ price: 15, volume: 10 });
    const trackers = [trackerA, trackerB, trackerC];
  });
});
