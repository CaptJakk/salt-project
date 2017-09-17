const handleBalances = (req, res) => res.status(404).send('Not Found');
const handleBalanceSymbol = (req, res) => res.status(404).send('Not Found');
const handleValueUsd = (req, res) => res.status(404).send('Not Found');
const handleValueBtc = (req, res) => res.status(404).send('Not Found');
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
