const fmysql = require('../../utils/fmysql.js');
const { S, F } = require('../../utils/sanctuaryEnv.js');
const saltPass = pass => pass + 'BUDWEISER';
const getUserPassword = (user, pass) => {
  const safeUsername = fmysql.escape(user);
  const safePassword = fmysql.escape(saltPass(pass));
  const query = `SELECT userid, username, admin FROM users WHERE username = ${safeUsername} AND password = SHA2(${safePassword}, 256);`;
  return fmysql.statelessQuery(query)
    .chain(S.compose(S.maybeToFuture(new Error('Invalid Credentials')), S.head))
    .map(data => ({ userid: data.userid, username: data.username, admin: data.admin }));
};

const usernameExists = user => {
  return getUser(user).fold(x => false, x => true);
};

const getUser = user => {
  const safeUsername = fmysql.escape(user);
  const query = `SELECT userid, username, admin FROM users WHERE username = ${safeUsername};`;
  return fmysql.statelessQuery(query)
    .chain(S.compose(S.maybeToFuture(new Error('User does not Exist')), S.head))
    .map(data => ({ userid: data.userid, username: data.username, admin: !!data.admin }));
};

const makeUser = (user, pass, admin) => {
  const safeUsername = fmysql.escape(user);
  const safeSaltedPass = fmysql.escape(saltPass(pass));
  const userQuery = `INSERT INTO users (username, password, admin) VALUES (${safeUsername}, SHA2(${safeSaltedPass}, 256), ${admin});`;
  const usdQuery = `INSERT INTO balances (username, asset, amount) VALUES (${safeUsername}, 'USD', 10000);`;
  const cryptoAssets = ['BTC', 'ETH', 'LTC', 'DOGE'];
  const cryptoValues = cryptoAssets.map(coin => `(${safeUsername}, '${coin}', 0)`);
  const cryptoQuery = `INSERT INTO balances (username, asset, amount) VALUES ${cryptoValues.join(',')};`;
  const query = `START TRANSACTION;\n${userQuery}\n${usdQuery}\n${cryptoQuery}\nCOMMIT;`;
  return fmysql.statelessQuery(query);
};

module.exports = {
  getUser,
  makeUser,
  getUserPassword,
  usernameExists
};
