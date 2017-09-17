/* eslint-env jest */
/* eslint-disable no-unused-expressions */
jest.mock('axios');
const data = require('../../../test-data/kraken-response.json');
const { getPriceVolume } = require('../../../../src/server/exchangeTrackers/BTC/krakenTracker.js');

describe('getPriceVolume succeeds', () => {
  require('axios').__setMockResponseSuccess(data);
  test('returns object with price and volume members each of which are numbers', done => {
    getPriceVolume('BTC', 'USD').done((err, res) => {
      expect(err).toBe.null;
      expect(res).toEqual({ price: 3750, volume: 8705.39762159 });
      done();
    });
  });
});
