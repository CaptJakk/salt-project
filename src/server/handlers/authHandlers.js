const fs = require('fs');
const jwt = require('jsonwebtoken');
const { S, F } = require('../../utils/sanctuaryEnv.js');
const fmysql = require('../../utils/fmysql.js');
const randomstring = require('randomstring');

let PRIVATE_KEY = null;
const getPrivateKey = () => {
  if (!PRIVATE_KEY) {
    PRIVATE_KEY = fs.readFileSync('server.key');
  }
  return PRIVATE_KEY;
};

// validateCredentials :: (String, String) -> Future Error JwtPayload
const validateCredentials = (queryFunc, username, password) => {
  const safeUsername = fmysql.escape(username);
  const saltedPassword = password + 'BUDWEISER';
  const safeSaltedPass = fmysql.escape(saltedPassword);
  const query = `SELECT * FROM USERS WHERE username = ${safeUsername} AND password = SHA2(${safeSaltedPass}, 256);`;
  return queryFunc(query)
    .chain(S.compose(S.maybeToFuture(new Error('Invalid Credentials')), S.head))
    .map(data => ({ userid: data.userid, username: data.username, admin: data.admin === 1 }));
};

// signUserToken :: Number -> JwtPayload -> Token
const signUserToken = S.curry2((expiration, payload) => {
  const options = {
    algorithm: 'RS256',
    expiresIn: expiration
  };
  return { ...payload, jwt: jwt.sign(payload, getPrivateKey(), options) };
});

// HANDLERS
// handleLogin :: (Request, Response) -> IO ()
const handleLogin = (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({ error: 'Bad Request' });
  }
  validateCredentials(fmysql.statelessQuery, req.body.username, req.body.password)
    .map(signUserToken('1h'))
    .done((err, data) => {
      if (err) {
        switch (err.message) {
          case 'Invalid Credentials':
            res.status(401).json({ error: 'Invalid Credentials' });
            return;
          default:
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
      } else {
        res.status(200).json(data);
      }
    });
};

// handleRegister :: (Request, Response) -> IO ()
const handleRegister = (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.confirmpass || !req.body.invitecode) {
    res.status(400).json({ error: 'Bad Request' });
  } else if (req.body.password !== req.body.confirmpass) {
    res.status(400).json({ error: 'Bad Request' });
  } else {
    const safeUsername = fmysql.escape(req.body.username);
    const saltedPassword = req.body.password + 'BUDWEISER';
    const safeSaltedPass = fmysql.escape(saltedPassword);
    const safeInviteCode = fmysql.escape(req.body.invitecode);
    const getInviteQuery = `SELECT invite FROM invites;`;
    const usernameExistsQuery = `SELECT username FROM users WHERE username = ${safeUsername};`;
    const makeUserQuery = `INSERT INTO users (username, password, admin) VALUES (${safeUsername}, SHA2(${safeSaltedPass}, 256), false);`;
    const consumeCodeQuery = `DELETE FROM invites WHERE invite = ${safeInviteCode};`;
    const getUserQuery = `SELECT userid, username, admin FROM users WHERE username = ${safeUsername};`;
    fmysql.statelessQuery(getInviteQuery)
      .map(data => data.map(el => el.invite))
      .map(data => data.filter(el => el === req.body.invitecode))
      .chain(data => data.length === 0 ? F.reject(new Error('Invalid Invite Code')) : F.of(S.head(data).value))
      .and(fmysql.statelessQuery(usernameExistsQuery))
      .map(data => data.map(el => el.username))
      .map(data => data.filter(el => el === req.body.username))
      .chain(data => data.length !== 0 ? F.reject(new Error('Username Already Exists' + data)) : F.of([]))
      .and(fmysql.statelessQuery(consumeCodeQuery))
      .and(fmysql.statelessQuery(makeUserQuery))
      .and(fmysql.statelessQuery(getUserQuery))
      .map(data => S.head(data).value)
      .map(data => ({ userid: data.userid, username: data.username, admin: !!data.admin }))
      .map(signUserToken('1h'))
      .done((err, data) => {
        if (err) {
          switch (err.message) {
            case 'Invalid Invite Code':
              res.status(401).json({ error: err.message });
              return;
            case 'Username Already Exists':
              res.status(403).json({ error: err.message });
              return;
            default:
              console.error(err);
              res.status(500).json({ error: 'Internal Server Error' });
          }
        } else {
          res.status(200).json(data);
        }
      });
  }
};

// handleInvite :: (Request, Response) -> IO ()
const handleInvite = (req, res) => {
  if (!req.user.admin) {
    res.status(401).send('Unauthorized Request');
  } else {
    const invitecode = randomstring.generate(10);
    const query = `INSERT INTO invites (invite) VALUES ('${invitecode}')`;
    fmysql.statelessQuery(query).done((err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ invitecode });
      }
    });
  }
};

const handleGetInvites = (req, res) => {
  if (!req.user.admin) {
    res.status(401).send('Unauthorized Request');
  } else {
    const query = `SELECT (invite) FROM invites;`;
    fmysql.statelessQuery(query)
      .map(data => data.map(el => el.invite))
      .done((err, data) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log(data);
          res.status(200).json(data);
        }
      });
  }
};

module.exports = {
  validateCredentials,
  signUserToken,
  handleLogin,
  handleRegister,
  handleInvite,
  handleGetInvites
};
