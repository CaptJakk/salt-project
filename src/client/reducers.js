import {
  RESET,
  SET_USERNAME,
  SET_PASSWORD,
  SET_CONFIRMPASS,
  SET_INVITECODE,
  SET_ERROR,
  SET_ADMIN,
  SET_INVITES,
  SET_PRICES,
  SET_BALANCES,
  SET_VALUE_USD,
  SET_VALUE_BTC
} from './actions.js';

const DEFAULT_STATE = {
  username: '',
  password: '',
  confirmpass: '',
  invitecode: '',
  error: '',
  admin: window.sessionStorage.getItem('admin') === 'true',
  invites: [],
  valueUsd: 0,
  valueBtc: 0
};

const setUsername = (state, action) => {
  const newState = {};
  Object.assign(newState, state, { username: action.username });
  return newState;
};
const setPassword = (state, action) => {
  const newState = {};
  Object.assign(newState, state, { password: action.password });
  return newState;
};
const setConfirmpass = (state, action) => {
  const newState = {};
  Object.assign(newState, state, { confirmpass: action.confirmpass });
  return newState;
};
const setInvitecode = (state, action) => {
  const newState = {};
  Object.assign(newState, state, { invitecode: action.invitecode });
  return newState;
};
const setError = (state, action) => {
  const newState = {};
  Object.assign(newState, state, { error: action.error });
  return newState;
};
const setAdmin = (state, action) => {
  const newState = {};
  Object.assign(newState, state, { admin: action.admin });
  return newState;
};
const setInvites = (state, action) => {
  const newState = {};
  Object.assign(newState, state, { invites: action.invites });
  return newState;
};
const setPrices = (state, action) => {
  const newState = {};
  Object.assign(newState, state, { prices: action.prices });
  return newState;
};
const setBalances = (state, action) => {
  const newState = {};
  Object.assign(newState, state, { balances: action.balances });
  return newState;
};
const setValueUsd = (state, action) => {
  const newState = {};
  Object.assign(newState, state, { valueUsd: action.valueUsd });
  return newState;
};
const setValueBtc = (state, action) => {
  const newState = {};
  Object.assign(newState, state, { valueBtc: action.valueBtc });
  return newState;
};

const rootReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case RESET:
      return DEFAULT_STATE;
    case SET_USERNAME:
      return setUsername(state, action);
    case SET_PASSWORD:
      return setPassword(state, action);
    case SET_CONFIRMPASS:
      return setConfirmpass(state, action);
    case SET_INVITECODE:
      return setInvitecode(state, action);
    case SET_ERROR:
      return setError(state, action);
    case SET_ADMIN:
      return setAdmin(state, action);
    case SET_INVITES:
      return setInvites(state, action);
    case SET_PRICES:
      return setPrices(state, action);
    case SET_BALANCES:
      return setBalances(state, action);
    case SET_VALUE_USD:
      return setValueUsd(state, action);
    case SET_VALUE_BTC:
      return setValueBtc(state, action);
    default:
      return state;
  }
};

export default rootReducer;
