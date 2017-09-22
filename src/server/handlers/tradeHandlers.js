const store = require('../stores/priceStore.js');
const balanceOps = require('../dbOperations/balancesTable.js');
const { S, F } = require('../../utils/sanctuaryEnv.js');

const hasSufficientFunds = (amount, price, funds) => {
  return amount * price <= funds;
};

const hasSufficientAssets = (amount, assets) => {
  return assets >= amount;
};

const handleBuyMarket = (req, res) => {
  if (req.user.username !== req.params.username) {
    res.status(401).send('Unauthorized Request');
  } else {
    console.log(req.body);
    const user = req.params.username;
    const asset = req.body.asset.split('-')[0];
    const metric = asset === 'BTC' ? 'USD' : 'BTC';
    const price = store.getPriceVolume(asset, metric).value.price;
    console.log(price);
    balanceOps.getBalance(req.params.username, metric)
      .map(funds => { console.log(funds, req.body.amount * price); return hasSufficientFunds(req.body.amount, price, funds); })
      .chain(sufficient => sufficient ? balanceOps.trade(user, 'BUY', asset, req.body.amount, price) : F.reject(new Error('Insufficient Funds')))
      .done((err, data) => {
        if (err) {
          console.error(err);
          switch (err.message) {
            case 'Insufficient Funds':
              res.status(403).send('Insufficient Funds');
              break;
            default:
              res.status(500).send('Internal Server Error');
          }
        } else {
          res.status(200).send('OK');
        }
      });
  }
};
const handleSellMarket = (req, res) => {
  if (req.user.username !== req.params.username) {
    res.status(401).send('Unauthorized Request');
  } else {
    console.log(req.body);
    const user = req.params.username;
    const asset = req.body.asset.split('-')[0];
    const metric = asset === 'BTC' ? 'USD' : 'BTC';
    const price = store.getPriceVolume(asset, metric).value.price;
    balanceOps.getBalance(req.params.username, metric)
      .map(funds => hasSufficientAssets(req.body.amount, price, funds))
      .chain(sufficient => sufficient ? balanceOps.trade(user, 'SELL', asset, req.body.amount, price) : F.reject(new Error('Insufficient Assets')))
      .done((err, data) => {
        if (err) {
          console.error(err);
          switch (err.message) {
            case 'Insufficient Assets':
              res.status(403).send('Insufficient Assets');
              break;
            default:
              res.status(500).send('Internal Server Error');
          }
        } else {
          res.status(200).send('OK');
        }
      });
  }
};

const handleBuyLoC = (req, res) => res.status(404).send('Not Found');
const handleSellLoC = (req, res) => res.status(404).send('Not Found');
const handleBuyLimit = (req, res) => res.status(404).send('Not Found');
const handleSellLimit = (req, res) => res.status(404).send('Not Found');

module.exports = {
  handleBuyMarket,
  handleSellMarket,
  handleBuyLoC,
  handleSellLoC,
  handleBuyLimit,
  handleSellLimit
};
