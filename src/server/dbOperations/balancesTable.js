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
    .chain(S.compose(S.maybeToFuture(new Error('User does not Exist')), S.head))
    .map(S.compose(JSON.parse, JSON.stringify))
    .map(row => row.amount);
};

const trade = (user, op, asset, amount, price) => {
  const counterAsset = asset === 'BTC' ? 'USD' : 'BTC';
  if (op === 'BUY') {
    const creditAmount = amount;
    const debitAmount = amount * price;
    const creditQuery = `UPDATE balances SET amount = amount + ${creditAmount} WHERE username = '${user}' AND asset = '${asset}';`;
    const debitQuery = `UPDATE balances SET amount = amount - ${debitAmount} WHERE username = '${user}' AND asset = '${counterAsset}';`;
    const query = `START TRANSACTION; ${creditQuery} ${debitQuery} COMMIT;`;
    return fmysql.statelessQuery(query);
  } else {
    const creditAmount = amount * price;
    const debitAmount = amount;
    const creditQuery = `UPDATE balances SET amount = amount + ${creditAmount} WHERE username = '${user}' AND asset = '${counterAsset}';`;
    const debitQuery = `UPDATE balances SET amount = amount - ${debitAmount} WHERE username = '${user}' AND asset = '${asset}';`;
    const query = `START TRANSACTION; ${creditQuery} ${debitQuery} COMMIT;`;
    return fmysql.statelessQuery(query);
  }
}

module.exports = {
  getBalance,
  getAllBalances,
  trade
};
