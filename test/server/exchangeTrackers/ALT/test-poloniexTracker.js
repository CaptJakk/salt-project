/* eslint-env jest */
/* eslint-disable no-unused-expressions */
jest.mock('axios');
const data = require('../../../test-data/poloniex-response.json');
const { getPriceVolume } = require('../../../../src/server/exchangeTrackers/ALT/poloniexTracker.js');

describe('getPriceVolume succeeds: ltc-btc', () => {
  beforeEach(() => {
    require('axios').__setMockResponseSuccess(data);
  });
  test('returns object with price and volume members each of which are numbers: ltc-btc', done => {
    getPriceVolume('LTC', 'BTC').done((err, res) => {
      expect(err).toBe.null;
      expect(res).toEqual({ price: 0.0140208, volume: 257444.90266734 });
      done();
    });
  });
});
describe('getPriceVolume succeeds: eth-btc', () => {
  beforeEach(() => {
    require('axios').__setMockResponseSuccess(data);
  });
  test('returns object with price and volume members each of which are numbers: eth-btc', done => {
    getPriceVolume('ETH', 'BTC').done((err, res) => {
      expect(err).toBe.null;
      expect(res).toEqual({ price: 0.06894413, volume: 95782.2433674 });
      done();
    });
  });
});
describe('getPriceVolume succeeds: doge-btc', () => {
  beforeEach(() => {
    require('axios').__setMockResponseSuccess(data);
  });
  test('returns object with price and volume members each of which are numbers: doge-btc', done => {
    getPriceVolume('DOGE', 'BTC').done((err, res) => {
      expect(err).toBe.null;
      expect(res).toEqual({ price: 2.4e-7, volume: 2109595729.7704122 });
      done();
    });
  });
});
