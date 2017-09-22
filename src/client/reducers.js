import {
  RESET,
  SET_USERNAME,
  SET_PASSWORD,
  SET_CONFIRMPASS,
  SET_INVITECODE,
  SET_ERROR,
  SET_ADMIN,
  SET_INVITES
} from './actions.js';

const DEFAULT_STATE = {
  username: '',
  password: '',
  confirmpass: '',
  invitecode: '',
  error: '',
  admin: window.sessionStorage.getItem('admin') === 'true',
  invites: []
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
    default:
      return state;
  }
};

export default rootReducer;
