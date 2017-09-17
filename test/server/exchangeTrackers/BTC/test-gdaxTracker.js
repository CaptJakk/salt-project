/* eslint-env jest */
/* eslint-disable no-unused-expressions */
jest.mock('axios');
const data = require('../../../test-data/gdax-response.json');
const { getPriceVolume } = require('../../../../src/server/exchangeTrackers/BTC/gdaxTracker.js');

describe('getPriceVolume succeeds', () => {
  require('axios').__setMockResponseSuccess(data);
  test('returns object with price and volume members each of which are numbers', done => {
    getPriceVolume('BTC', 'USD').done((err, res) => {
      expect(err).toBe.null;
      expect(res).toEqual({ price: 3734.99, volume: 19816.32662459 });
      done();
    });
  });
});
