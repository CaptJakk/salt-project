const { create, env } = require('sanctuary');
const { env: flutureEnv } = require('fluture-sanctuary-types');
const F = require('fluture');
const checkTypes = process.env.NODE_ENV !== 'production';
const S = create({checkTypes, env: env.concat(flutureEnv)});

module.exports = { S, F };
