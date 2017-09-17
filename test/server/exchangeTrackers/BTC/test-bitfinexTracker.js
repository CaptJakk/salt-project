/* eslint-env jest */
/* eslint-disable no-unused-expressions */
jest.mock('axios');
const data = require('../../../test-data/bitfinex-response.json');
const { getPriceVolume } = require('../../../../src/server/exchangeTrackers/BTC/bitfinexTracker.js');

describe('getPriceVolume succeeds', () => {
  require('axios').__setMockResponseSuccess(data);
  test('returns object with price and volume members each of which are numbers', done => {
    getPriceVolume('BTC', 'USD').done((err, res) => {
      expect(err).toBe.null;
      expect(res).toEqual({ price: 3710.4, volume: 72286.37696885 });
      done();
    });
  });
});
