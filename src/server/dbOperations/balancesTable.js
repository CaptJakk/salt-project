const fmysql = require('../../utils/fmysql.js');
const { S } = require('../../utils/sanctuaryEnv.js');
const getAllBalances = user => {
  const safeUsername = fmysql.escape(user);
  const query = `SELECT asset, amount FROM balances WHERE username = ${safeUsername};`;
  return fmysql.statelessQuery(query)
    .map(S.compose(JSON.parse, JSON.stringify))
    .map(S.reduce(a => b => ({ ...a, [b.asset]: b.amount }), {}));
};

const getBalance = (user, asset) => {
  const safeUsername = fmysql.escape(user);
  const safeAsset = fmysql.escape(asset);
  const query = `SELECT asset, amount FROM balances WHERE username = ${safeUsername} AND asset = ${safeAsset};`;
  return fmysql.statelessQuery(query)
    .map(S.componse(JSON.parse, JSON.stringify))
    .map(row => ({ [row.asset]: row.amount }));
};

module.exports = {
  getBalance,
  getAllBalances
};
