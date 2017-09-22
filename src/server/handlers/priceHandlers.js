const { getAllPriceVolumes, getPriceVolume } = require('../stores/priceStore.js');

const invalidPairErr = symbol => ({ error: `Invalid trading pair ${symbol}` });

const handlePrices = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(getAllPriceVolumes());
};
const handlePriceSymbol = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const symbol = req.params.symbol;
  const pair = symbol.toUpperCase().split('-');
  if (pair.length !== 2) {
    res.status(400).send(invalidPairErr(symbol));
  }
  const pv = getPriceVolume(pair[0], pair[1]);
  if (pv.isLeft) {
    res.status(400).json({ error: pv.value });
  }
  res.status(200).send(JSON.stringify(pv.value));
};

module.exports = {
  handlePrices,
  handlePriceSymbol
};
