/* eslint-env jest */
/* eslint-disable no-unused-expressions */
jest.mock('axios');
const ltcData = require('../../../test-data/bittrex-ltc-response.json');
const ethData = require('../../../test-data/bittrex-eth-response.json');
const dogeData = require('../../../test-data/bittrex-doge-response.json');
const { getPriceVolume } = require('../../../../src/server/exchangeTrackers/ALT/bittrexTracker.js');

describe('getPriceVolume succeeds: ltc-btc', () => {
  beforeEach(() => {
    require('axios').__setMockResponseSuccess(ltcData);
  });
  test('returns object with price and volume members each of which are numbers: ltc-btc', done => {
    getPriceVolume('LTC', 'BTC').done((err, res) => {
      expect(err).toBe.null;
      expect(res).toEqual({ price: 0.01412101, volume: 111119.45864568 });
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
      expect(res).toEqual({ price: 0.069, volume: 54025.47954004 });
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
      expect(res).toEqual({ price: 2.4e-7, volume: 2943761183.12973 });
      done();
    });
  });
});
