const { create, env } = require('sanctuary');
const { env: flutureEnv } = require('fluture-sanctuary-types');
const { Future, Par, seq } = require('fluture');
const checkTypes = process.env.NODE_ENV !== 'production';
const S = create({checkTypes, env: env.concat(flutureEnv)});

S.any = S.curry2((pred, list) => S.reduce(S.or, false, S.map(pred, list)));
S.all = S.curry2((pred, list) => S.reduce(S.and, true, S.map(pred, list)));
S.contains = S.curry2((elem, list) => S.any(S.equals(elem), list));

module.exports = { S, F: Future, P: Par, seq };
