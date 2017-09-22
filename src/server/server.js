var fs = require('fs');
var http = require('http');
var https = require('https');
var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var jwt = require('express-jwt');
var webpackDevMiddleware = require('webpack-dev-middleware');
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
var publicKey = fs.readFileSync('pubkey.pem', 'utf-8');
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
  console.log('NOT PRODUCTION');
  app.use(webpackDevMiddleware(compiler, {
    hot: true,
    filename: 'bundle.js',
    publicPath: '/',
    stats: {
      colors: true
    },
    historyApiFallback: true
  }));
  /*
  app.use(webpackHotMiddleWare(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
    reload: true
  }));
  */
}
app.use(bodyParser.json());
app.use(jwt({ secret: publicKey }).unless({ path: ['/', '/api/price', '/api/prices', '/api/login', '/api/register'] }));
app.use((err, req, res, next) => {
  console.error(req.get('Authorization'));
  if (err.name === 'UnauthorizedError') {
    console.error(err);
    res.status(401).json({ error: 'invalid token' });
  }
});

// Price Fetching Background Job
// priceFetchErr :: (String, String) -> Error -> IO ()
const priceFetchErr = (asset, metric) => err =>
  console.error(`Failed to fetch price for ${asset}-${metric} pair: ${err.message}`);

// fetchAllPriceVolumes :: () -> IO ()
const fetchAllPriceVolumes = () => {
  priceVolumeOfPair(exchangeTrackersBtc, BTC, USD).fork(priceFetchErr(BTC, USD), setPriceVolume(BTC, USD));
  priceVolumeOfPair(exchangeTrackersAlt, LTC, BTC).fork(priceFetchErr(LTC, BTC), setPriceVolume(LTC, BTC));
  priceVolumeOfPair(exchangeTrackersAlt, ETH, BTC).fork(priceFetchErr(ETH, BTC), setPriceVolume(ETH, BTC));
  priceVolumeOfPair(exchangeTrackersAlt, DOGE, BTC).fork(priceFetchErr(DOGE, BTC), setPriceVolume(DOGE, BTC));
};

// kick off price fetching interval
fetchAllPriceVolumes();
setInterval(fetchAllPriceVolumes, 60000);

// app.get('/', (req, res) => res.redirect('../../www/index.js'));
// API Route Definitions
// Price Fetching API's
// Get all prices

app.get('/api/prices', apiHandlers.handlePrices);
// Get price for specific trading pair
app.get('/api/price/:symbol', apiHandlers.handlePriceSymbol);

// Account Info API's
// Get Balances
app.get('/api/:username/balances', apiHandlers.handleBalances);
// Get Specific Balance
app.get('/api/:username/balance/:symbol', apiHandlers.handleBalanceSymbol);
// Get Portfolio Balance in USD
app.get('/api/:username/portfolio/value/USD', apiHandlers.handleValueUsd); // Not sure how valuable this is
// Get Portfolio Balance in BTC
app.get('/api/:username/portfolio/value/BTC', apiHandlers.handleValueBtc); // Not sure how valuable this is
// Get Portfolio Breakdown in percentage value
app.get('/api/:username/portfolio/breakdown', apiHandlers.handleBreakdown);
// Get Transaction History
app.get('/api/:username/history', apiHandlers.handleHistory);

// Trading API's
// Buy Market
app.post('/api/:username/buy/market', apiHandlers.handleBuyMarket);
// Sell Market
app.post('/api/:username/sell/market', apiHandlers.handleSellMarket);
// Buy Limit or Cancel
app.post('/api/:username/buy/limitOrCancel', apiHandlers.handleBuyLoC);
// Sell Limit or Cancel
app.post('/api/:username/sell/limitOrCancel', apiHandlers.handleSellLoC);
// Buy Limit
app.post('/api/:username/buy/limit', apiHandlers.handleBuyLimit);
// Sell Limit
app.post('/api/:username/sell/limit', apiHandlers.handleSellLimit);

// Log in
app.post('/api/login', apiHandlers.handleLogin);
app.post('/api/register', apiHandlers.handleRegister);

app.get('/api/invite', apiHandlers.handleGetInvites);
app.post('/api/invite', apiHandlers.handleInvite);

// Launch Server
const credentials = { key: privateKey, cert: certificate };
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
httpServer.listen(80);
httpsServer.listen(443);
