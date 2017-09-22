const fs = require('fs');
const jwt = require('jsonwebtoken');
const { S, F } = require('../../utils/sanctuaryEnv.js');
const userOps = require('../dbOperations/usersTable.js');
const inviteOps = require('../dbOperations/invitesTable.js');

let PRIVATE_KEY = null;
const getPrivateKey = () => {
  if (!PRIVATE_KEY) {
    PRIVATE_KEY = fs.readFileSync('server.key');
  }
  return PRIVATE_KEY;
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
  userOps.getUserPassword(req.body.username, req.body.password)
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
    const validUsernames = /^[a-z0-9]+$/i;
    if (!req.body.username.match(validUsernames)) {
      return F.reject(new Error('Username Must Be Alphanumeric'));
    }
    const username = req.body.username;
    const password = req.body.password;
    const invitecode = req.body.invitecode;
    inviteOps.verifyInvite(req.body.invitecode)
      .chain(data => !data ? F.reject(new Error('Invalid Invite Code')) : F.of(data))
      .and(userOps.usernameExists(req.body.username))
      .chain(data => data ? F.reject(new Error('Username Already Exists: ' + username)) : F.of(data))
      .and(inviteOps.consumeInvite(invitecode))
      .and(userOps.makeUser(username, password, false))
      .and(userOps.getUser(username))
      .map(signUserToken('1h'))
      .done((err, data) => {
        if (err) {
          console.error(err);
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
    inviteOps.generateInvite(10).done((err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(data);
      }
    });
  }
};

const handleGetInvites = (req, res) => {
  if (!req.user.admin) {
    res.status(401).send('Unauthorized Request');
  } else {
    inviteOps.getInvites()
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
  signUserToken,
  handleLogin,
  handleRegister,
  handleInvite,
  handleGetInvites
};
