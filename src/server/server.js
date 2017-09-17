var path = require('path');
var express = require('express');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleWare = require('webpack-hot-middleware');
var webpack = require('webpack');
var webpackConfig = require('../../webpack.config.js');
const priceTracker = require('./priceTracker.js');
const apiHandlers = require('./handlers/apiHandlers.js');
const { USD, BTC, LTC, ETH, DOGE } = require('../utils/symbolConstants.js');
const {
  exchangeTrackersAlt,
  exchangeTrackersBtc,
  priceVolumeOfPair
} = priceTracker;

// App Setup
var app = express();
var compiler = webpack(webpackConfig);
app.use(express.static(path.resolve(__dirname, '/../../www')));
if (process.env.NODE_ENV !== 'production') {
  app.use(webpackDevMiddleware(compiler, {
    hot: true,
    filename: 'bundle.js',
    publicPath: '/',
    stats: {
      colors: true
    },
    historyApiFallback: true
  }));
  app.use(webpackHotMiddleWare(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
    reload: true
  }));
}

// Price Fetching Background Job
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

// setPriceVolume :: (PriceStore, String, String) -> (Error, PriceVolume) -> IO ()
const setPriceVolume = (priceStore, asset, metric) => (err, res) => {
  if (err) {
    console.error(`Failed to fetch price for ${asset}-${metric} pair`);
  }
  priceStore[asset][metric] = res;
  console.log(res);
};

// fetchAllPriceVolumes :: () -> IO ()
const fetchAllPriceVolumes = () => {
  priceVolumeOfPair(exchangeTrackersBtc, BTC, USD).done(setPriceVolume(priceVolumes, BTC, USD));
  priceVolumeOfPair(exchangeTrackersAlt, LTC, BTC).done(setPriceVolume(priceVolumes, LTC, BTC));
  priceVolumeOfPair(exchangeTrackersAlt, ETH, BTC).done(setPriceVolume(priceVolumes, ETH, BTC));
  priceVolumeOfPair(exchangeTrackersAlt, DOGE, BTC).done(setPriceVolume(priceVolumes, DOGE, BTC));
};

// kick off price fetching interval
fetchAllPriceVolumes();
setInterval(fetchAllPriceVolumes, 60000);

// API Route Definitions
// Price Fetching API's
// Get all prices
app.get('/prices', apiHandlers.handlePrices);
// Get price for specific trading pair
app.get('/price/:symbol', apiHandlers.handlePriceSymbol);

// Account Info API's
// Get Balances
app.get('/:username/balances', apiHandlers.handleBalances);
// Get Specific Balance
app.get('/:username/balance/:symbol', apiHandlers.handleBalanceSymbol);
// Get Portfolio Balance in USD
app.get('/:username/portfolio/value/USD', apiHandlers.handleValueUsd); // Not sure how valuable this is
// Get Portfolio Balance in BTC
app.get('/:username/portfolio/value/BTC', apiHandlers.handleValueBtc); // Not sure how valuable this is
// Get Portfolio Breakdown in percentage value
app.get('/:username/portfolio/breakdown', apiHandlers.handleBreakdown);
// Get Transaction History
app.get('/:username/history', apiHandlers.handleHistory);

// Trading API's
// Buy Market
app.post('/:username/buy/market', apiHandlers.handleBuyMarket);
// Sell Market
app.post('/:username/sell/market', apiHandlers.handleSellMarket);
// Buy Limit or Cancel
app.post('/:username/buy/limitOrCancel', apiHandlers.handleBuyLoC);
// Sell Limit or Cancel
app.post('/:username/sell/limitOrCancel', apiHandlers.handleSellLoC);
// Buy Limit
app.post('/:username/buy/limit', apiHandlers.handleBuyLimit);
// Sell Limit
app.post('/:username/sell/limit', apiHandlers.handleSellLimit);

// Auth API
app.get('/login', apiHandlers.handleLoginPage);
// Log in
app.post('/login', apiHandlers.handleLogin);
// Log out
app.post('/logout', apiHandlers.handleLogout);

// Launch Server
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
