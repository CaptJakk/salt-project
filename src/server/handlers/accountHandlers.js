const store = require('../stores/priceStore.js');
const balanceOps = require('../dbOperations/balancesTable.js');
const { S } = require('../../utils/sanctuaryEnv.js');

const handleBalances = (req, res) => {
  if (req.user.username !== req.params.username) {
    res.status(401).send('Unauthorized Request');
  } else {
    balanceOps.getAllBalances(req.params.username).done((err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error ' });
      } else {
        res.status(200).json(data);
      }
    });
  }
};

const handleBalanceSymbol = (req, res) => {
  if (req.user.username !== req.params.username) {
    res.status(401).send('Unauthorized Request');
  } else {
    balanceOps.getBalance(req.params.username, req.params.symbol).done((err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(data);
      }
    });
  }
};

const getValue = (converter, username) =>
  balanceOps.getAllBalances(username)
    .map(bal => Object.entries(bal).map(x => converter(x[0], x[1])))
    .map(S.reduce(S.add, 0));

const handleValueUsd = (req, res) => {
  if (req.user.username !== req.params.username) {
    res.status(401).send('Unauthorized Request');
  } else {
    getValue(store.convertToUsd, req.params.username).done((err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ value: data });
      }
    });
  }
};

const handleValueBtc = (req, res) => {
  if (req.user.username !== req.params.username) {
    res.status(401).send('Unauthorized Request');
  } else {
    getValue(store.convertToBtc, req.params.username).done((err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ value: data });
      }
    });
  }
};

const handleBreakdown = (req, res) => res.status(404).send('Not Found');
const handleHistory = (req, res) => res.status(404).send('Not Found');

module.exports = {
  handleBalances,
  handleBalanceSymbol,
  handleValueUsd,
  handleValueBtc,
  handleBreakdown,
  handleHistory
};
