const handleBuyMarket = (req, res) => res.status(404).send('Not Found');
const handleSellMarket = (req, res) => res.status(404).send('Not Found');
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
