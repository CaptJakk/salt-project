/* eslint-env jest */
/* eslint-disable no-unused-expressions */
jest.mock('axios');
const ltcData = require('../../../test-data/hitbtc-ltc-response.json');
const ethData = require('../../../test-data/hitbtc-eth-response.json');
const dogeData = require('../../../test-data/hitbtc-doge-response.json');
const { getPriceVolume } = require('../../../../src/server/exchangeTrackers/ALT/hitbtcTracker.js');

describe('getPriceVolume succeeds: ltc-btc', () => {
  beforeEach(() => {
    require('axios').__setMockResponseSuccess(ltcData);
  });
  test('returns object with price and volume members each of which are numbers: ltc-btc', done => {
    getPriceVolume('LTC', 'BTC').done((err, res) => {
      expect(err).toBe.null;
      expect(res).toEqual({ price: 0.01412, volume: 23884 });
      done();
    });
  });
});
describe('getPriceVolume succeeds: eth-btc', () => {
  beforeEach(() => {
    require('axios').__setMockResponseSuccess(ethData);
  });
  test('returns object with price and volume members each of which are numbers: eth-btc', done => {
    getPriceVolume('ETH', 'BTC').done((err, res) => {
      expect(err).toBe.null;
      expect(res).toEqual({ price: 0.069076, volume: 23576.133 });
      done();
    });
  });
});
describe('getPriceVolume succeeds: doge-btc', () => {
  beforeEach(() => {
    require('axios').__setMockResponseSuccess(dogeData);
  });
  test('returns object with price and volume members each of which are numbers: doge-btc', done => {
    getPriceVolume('DOGE', 'BTC').done((err, res) => {
      expect(err).toBe.null;
      expect(res).toEqual({ price: 2.45e-7, volume: 2199073000 });
      done();
    });
  });
});
