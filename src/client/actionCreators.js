import {
  RESET,
  SET_USERNAME,
  SET_PASSWORD,
  SET_CONFIRMPASS,
  SET_INVITECODE,
  SET_ERROR,
  SET_ADMIN,
  SET_INVITES
} from './actions';
const faxios = require('../utils/faxios.js');

export function reset () {
  return { type: RESET };
}
export function setUsername (username) {
  return { type: SET_USERNAME, username };
}
export function setPassword (password) {
  return { type: SET_PASSWORD, password };
}
export function setConfirmpass (confirmpass) {
  return { type: SET_CONFIRMPASS, confirmpass };
}
export function setInvitecode (invitecode) {
  return { type: SET_INVITECODE, invitecode };
}
export function setError (error) {
  return { type: SET_ERROR, error };
}
export function setAdmin (admin) {
  return { type: SET_ADMIN, admin };
}
export function setInvites (invites) {
  return { type: SET_INVITES, invites };
}

export function sendRegistration (router) {
  return (dispatch, getState) => {
    const state = getState();
    const { username, password, confirmpass, invitecode } = state;
    const body = { username, password, confirmpass, invitecode };
    faxios.post2('/api/register', body).done((err, res) => {
      dispatch(reset());
      if (err) {
        dispatch(setError(err.message));
      } else {
        dispatch(setError(''));
        window.sessionStorage.setItem('userid', res.data.userid);
        window.sessionStorage.setItem('username', res.data.username);
        window.sessionStorage.setItem('admin', res.data.admin);
        window.sessionStorage.setItem('jwt', res.data.jwt);
        if (res.data.admin) {
          dispatch(setAdmin(true));
        }
      }
      router.history.push('/');
    });
  };
}

export function sendLogin (router) {
  return (dispatch, getState) => {
    const state = getState();
    const { username, password } = state;
    const body = { username, password };
    faxios.post2('/api/login', body).done((err, res) => {
      dispatch(reset());
      if (err) {
        dispatch(setError(err.message));
      } else {
        dispatch(setError(''));
        window.sessionStorage.setItem('userid', res.data.userid);
        window.sessionStorage.setItem('username', res.data.username);
        window.sessionStorage.setItem('admin', res.data.admin);
        window.sessionStorage.setItem('jwt', res.data.jwt);
        if (res.data.admin) {
          dispatch(setAdmin(true));
        }
      }
      router.history.push('/');
    });
  };
}

export function sendLogout (router) {
  return (dispatch, getState) => {
    dispatch(reset());
    window.sessionStorage.removeItem('userid');
    window.sessionStorage.removeItem('username');
    window.sessionStorage.removeItem('admin');
    window.sessionStorage.removeItem('jwt');
    router.history.push('/');
  };
}

export function sendInvite () {
  return (dispatch, getState) => {
    const body = {};
    const authHeader = { 'Authorization': `Bearer ${window.sessionStorage.getItem('jwt')}` };
    const headers = { headers: authHeader };
    faxios.post3('/api/invite', body, headers).done((err, res) => {
      if (err) {
        console.error(err);
      } else {
        const newInvites = getState().invites.slice();
        newInvites.push(res.data.invitecode);
        console.log(newInvites);
        dispatch(setInvites(newInvites));
      }
    });
  };
}

export function getInvites () {
  return (dispatch, getState) => {
    const authHeader = { 'Authorization': `Bearer ${window.sessionStorage.getItem('jwt')}` };
    const headers = { headers: authHeader };
    faxios.get('/api/invite', headers).done((err, res) => {
      if (err) {
        console.error(err);
      } else {
        dispatch(setInvites(res.data));
      }
    });
  };
}
