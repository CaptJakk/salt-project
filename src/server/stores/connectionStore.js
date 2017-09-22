let connection = null;

const setConnection = (conn) => {
  connection = conn;
};

const getConnection = () => connection;

module.exports = {
  getConnection,
  setConnection
};
