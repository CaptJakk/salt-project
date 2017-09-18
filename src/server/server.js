var fs = require('fs');
var http = require('http');
var https = require('https');
var path = require('path');
var express = require('express');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleWare = require('webpack-hot-middleware');
var webpack = require('webpack');
var webpackConfig = require('../../webpack.config.js');
const priceTracker = require('./priceTracker.js');
const apiHandlers = require('./handlers/apiHandlers.js');
const { USD, BTC, LTC, ETH, DOGE } = require('../utils/symbolConstants.js');
const { setPriceVolume } = require('./stores/priceStore.js');
const {
  exchangeTrackersAlt,
  exchangeTrackersBtc,
  priceVolumeOfPair
} = priceTracker;

// App Setup
var app = express();
var privateKey = fs.readFileSync('server.key', 'utf-8');
var certificate = fs.readFileSync('server.crt', 'utf-8');
const requireHTTPS = (req, res, next) => {
  if (!req.secure) {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
};
app.use(requireHTTPS);
var compiler = webpack(webpackConfig);
app.use(express.static(path.resolve(__dirname, '../../www')));
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
// priceFetchErr :: (String, String) -> Error -> IO ()
const priceFetchErr = (asset, metric) => err =>
  console.error(`Failed to fetch price for ${asset}-${metric} pair: ${err.message}`);

// fetchAllPriceVolumes :: () -> IO ()
const fetchAllPriceVolumes = () => {
  priceVolumeOfPair(exchangeTrackersBtc, BTC, USD).fork(priceFetchErr(BTC, USD), setPriceVolume(BTC, USD));
  priceVolumeOfPair(exchangeTrackersAlt, LTC, BTC).fork(priceFetchErr(LTC, BTC), setPriceVolume(LTC, BTC));
  priceVolumeOfPair(exchangeTrackersAlt, ETH, BTC).fork(priceFetchErr(ETH, USD), setPriceVolume(ETH, BTC));
  priceVolumeOfPair(exchangeTrackersAlt, DOGE, BTC).fork(priceFetchErr(DOGE, USD), setPriceVolume(DOGE, BTC));
};

// kick off price fetching interval
fetchAllPriceVolumes();
setInterval(fetchAllPriceVolumes, 60000);

// app.get('/', (req, res) => res.redirect('../../www/index.js'));
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
const credentials = { key: privateKey, cert: certificate };
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
httpServer.listen(80);
httpsServer.listen(443);
