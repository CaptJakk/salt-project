const accountHandlers = require('./accountHandlers.js');
const authHandlers = require('./authHandlers.js');
const priceHandlers = require('./priceHandlers.js');
const tradeHandlers = require('./tradeHandlers');

module.exports = {
  handlePrices: priceHandlers.handlePrices,
  handlePriceSymbol: priceHandlers.handlePriceSymbol,
  handleBalances: accountHandlers.handleBalances,
  handleBalanceSymbol: accountHandlers.handleBalanceSymbol,
  handleValueUsd: accountHandlers.handleValueUsd,
  handleValueBtc: accountHandlers.handleValueBtc,
  handleBreakdown: accountHandlers.handleBreakdown,
  handleHistory: accountHandlers.handleHistory,
  handleBuyMarket: tradeHandlers.handleBuyMarket,
  handleSellMarket: tradeHandlers.handleSellMarket,
  handleBuyLoC: tradeHandlers.handleBuyLoC,
  handleSellLoC: tradeHandlers.handleSellLoC,
  handleBuyLimit: tradeHandlers.handleBuyLimit,
  handleSellLimit: tradeHandlers.handleSellLimit,
  handleLoginPage: authHandlers.handleLoginPage,
  handleLogin: authHandlers.handleLogin,
  handleLogout: authHandlers.handleLogout
};
