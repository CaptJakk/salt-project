const { F } = require('./sanctuaryEnv.js');
const mysql = require('mysql');
const dbparams = {
  host: 'localhost',
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASS,
  database: 'saltproj'
};

const setup = () => mysql.createConnection(dbparams);
const teardown = (conn) => conn.end();
const statefulQuery = (conn, queryString) =>
  F((reject, resolve) => {
    var cancelled = false;
    conn.query(queryString, (err, res, fields) => {
      if (err) {
        if (!cancelled) {
          reject(err);
        }
      } else {
        if (!cancelled) {
          resolve(res);
        }
      }
    });
    return () => { cancelled = true; };
  });

const statelessQuery = queryString =>
  F.hook(
    F.of(setup()),
    conn => F.of(conn.end()),
    conn => statefulQuery(conn, queryString)
  );

const escape = value => mysql.escape(value);

const fmysql = { escape, setup, teardown, statefulQuery, statelessQuery };

module.exports = fmysql;
