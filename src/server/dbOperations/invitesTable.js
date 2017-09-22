const fmysql = require('../../utils/fmysql.js');
const { S, F } = require('../../utils/sanctuaryEnv.js');
const randomstring = require('randomstring');

const consumeInvite = code => {
  const safeCode = fmysql.escape(code);
  const query = `DELETE FROM invites WHERE invite = ${safeCode}`;
  return fmysql.statelessQuery(query);
};
const generateInvite = length => {
  const code = randomstring.generate(length);
  const query = `INSERT INTO invites (invite) VALUES (${fmysql.escape(code)});`;
  return fmysql.statelessQuery(query)
    .and(F.of({ invitecode: code }));
};
const verifyInvite = code => {
  const safeCode = fmysql.escape(code);
  const query = `SELECT invite FROM invites WHERE invite = ${safeCode};`;
  return fmysql.statelessQuery(query)
    .chain(S.compose(S.maybeToFuture(new Error('Invite does not Exist')), S.head))
    .fold(x => false, x => true);
};

const getInvites = () => {
  const query = `SELECT invite FROM invites;`;
  return fmysql.statelessQuery(query)
    .map(data => data.map(el => el.invite));
};

module.exports = {
  generateInvite,
  verifyInvite,
  consumeInvite,
  getInvites
};
